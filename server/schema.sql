-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  display_name TEXT,
  email TEXT NOT NULL UNIQUE,
  profile_picture TEXT,
  google_id TEXT UNIQUE,
  github_id TEXT UNIQUE,
  role TEXT DEFAULT 'researcher',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Papers table
CREATE TABLE IF NOT EXISTS papers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  abstract TEXT,
  content TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  filename TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  file_size INTEGER,
  tags TEXT[],
  metadata JSONB,
  is_processed BOOLEAN DEFAULT FALSE
);

-- Summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER NOT NULL,
  bullet_points TEXT,
  section_wise JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Citations table
CREATE TABLE IF NOT EXISTS citations (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER NOT NULL,
  cited_title TEXT,
  cited_authors TEXT,
  cited_year TEXT,
  cited_doi TEXT,
  citation_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  page_number INTEGER,
  content TEXT NOT NULL,
  highlighted_text TEXT,
  position JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research goals table
CREATE TABLE IF NOT EXISTS research_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP,
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create session table for Passport session storage
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);