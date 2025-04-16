import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './storage';
import { User as SelectUser, InsertUser } from '@shared/schema';
import { log } from './vite';
import { db } from './db';

// Extend Express User interface to use our User type
declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Convert scrypt to promise-based
const scryptAsync = promisify(scrypt);

// Hash password using scrypt
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Compare password with hashed version
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Sets up authentication middleware and routes for the application
 */
export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax'
    }
  };

  // Trust proxy if in production
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Set up session
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username or email
        let user = await storage.getUserByUsername(username);
        
        // If not found by username, try by email
        if (!user) {
          // Try to find by email
          const [userByEmail] = await db.select().from(users).where(eq(users.email, username));
          if (userByEmail) {
            user = userByEmail;
          }
        }

        // If no user found or password doesn't match
        if (!user || !user.password || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        // Update last login time
        await db.update(users)
          .set({ lastLogin: new Date() })
          .where(eq(users.id, user.id));

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Configure Google OAuth strategy if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            const [existingUser] = await db.select().from(users).where(eq(users.googleId, profile.id));
            
            if (existingUser) {
              // Update last login time
              await db.update(users)
                .set({ lastLogin: new Date() })
                .where(eq(users.id, existingUser.id));
                
              return done(null, existingUser);
            }
            
            // Check if email already exists
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('Google account does not have an email'));
            }
            
            const [userWithEmail] = await db.select().from(users).where(eq(users.email, email));
            
            if (userWithEmail) {
              // Link Google account to existing user
              const updatedUser = await db.update(users)
                .set({ 
                  googleId: profile.id,
                  lastLogin: new Date(),
                  profilePicture: profile.photos?.[0]?.value || userWithEmail.profilePicture 
                })
                .where(eq(users.id, userWithEmail.id))
                .returning();
                
              return done(null, updatedUser[0]);
            }
            
            // Create new user
            const newUser = await storage.createUser({
              username: email.split('@')[0] + '_' + randomBytes(4).toString('hex'),
              email,
              displayName: profile.displayName,
              profilePicture: profile.photos?.[0]?.value,
              googleId: profile.id
            });
            
            return done(null, newUser);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  } else {
    log('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.', 'auth');
  }

  // Configure GitHub OAuth strategy if credentials are available
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: '/api/auth/github/callback',
          scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            const [existingUser] = await db.select().from(users).where(eq(users.githubId, profile.id));
            
            if (existingUser) {
              // Update last login time
              await db.update(users)
                .set({ lastLogin: new Date() })
                .where(eq(users.id, existingUser.id));
                
              return done(null, existingUser);
            }
            
            // Get primary email from GitHub
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('GitHub account does not have an email'));
            }
            
            const [userWithEmail] = await db.select().from(users).where(eq(users.email, email));
            
            if (userWithEmail) {
              // Link GitHub account to existing user
              const updatedUser = await db.update(users)
                .set({ 
                  githubId: profile.id.toString(),
                  lastLogin: new Date(),
                  profilePicture: profile.photos?.[0]?.value || userWithEmail.profilePicture 
                })
                .where(eq(users.id, userWithEmail.id))
                .returning();
                
              return done(null, updatedUser[0]);
            }
            
            // Create new user
            const newUser = await storage.createUser({
              username: profile.username || email.split('@')[0] + '_' + randomBytes(4).toString('hex'),
              email,
              displayName: profile.displayName || profile.username,
              profilePicture: profile.photos?.[0]?.value,
              githubId: profile.id.toString()
            });
            
            return done(null, newUser);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  } else {
    log('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable it.', 'auth');
  }

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  // Register route
  app.post('/api/auth/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Check if email exists
      const [userWithEmail] = await db.select().from(users).where(eq(users.email, req.body.email));
      if (userWithEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: req.body.password ? await hashPassword(req.body.password) : null
      });
      
      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post('/api/auth/login', 
    (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate('local', (err: Error, user: SelectUser, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || 'Authentication failed' });
        
        req.login(user, (err) => {
          if (err) return next(err);
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
      })(req, res, next);
    }
  );

  // Logout route
  app.post('/api/auth/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Current user route
  app.get('/api/auth/user', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Google OAuth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google', passport.authenticate('google'));
    
    app.get('/api/auth/google/callback', 
      passport.authenticate('google', { 
        failureRedirect: '/auth?error=google-auth-failed'
      }),
      (req: Request, res: Response) => {
        res.redirect('/');
      }
    );
  }

  // GitHub OAuth routes
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    app.get('/api/auth/github', passport.authenticate('github'));
    
    app.get('/api/auth/github/callback', 
      passport.authenticate('github', { 
        failureRedirect: '/auth?error=github-auth-failed'
      }),
      (req: Request, res: Response) => {
        res.redirect('/');
      }
    );
  }
}

// Import needed for use in auth.ts
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';