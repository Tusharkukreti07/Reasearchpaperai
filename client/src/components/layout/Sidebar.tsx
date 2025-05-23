import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  DashboardIcon,
  PaperIcon,
  SearchIcon,
  ChatIcon,
  GraphIcon,
  CompareIcon,
  BookmarkIcon,
  ExportIcon,
  UserIcon,
  EditIcon
} from '@/lib/icons';
import { BookOpen, FileText, Users, BookmarkIcon as BookmarkLucide, PenLine, BarChart2, BookCopy, MessageSquare, Image } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
  return (
    <li className="mb-1">
      <Link href={href}>
        <a
          className={cn(
            "flex items-center px-3 py-2.5 rounded-lg font-medium",
            isActive
              ? "bg-primary-50 text-primary-600"
              : "text-neutral-700 hover:bg-neutral-100"
          )}
        >
          <div className="text-xl md:mr-3">{icon}</div>
          <span className="hidden md:block">{label}</span>
        </a>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 ease-in-out">
      {/* Logo & Brand */}
      <div className="px-4 py-5 flex items-center">
        <div className="rounded-lg bg-primary-600 w-10 h-10 flex items-center justify-center text-white">
          <i className="ri-book-read-line text-xl"></i>
        </div>
        <h1 className="ml-3 font-semibold text-lg hidden md:block">Research Paper AI</h1>
      </div>
      
      {/* Primary Navigation */}
      <nav className="mt-4 flex-1">
        <div className="px-3 md:px-4">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider hidden md:block mb-2">Main</div>
          <ul>
            <NavItem 
              href="/" 
              icon={<DashboardIcon className="w-5 h-5" />} 
              label="Dashboard" 
              isActive={location === '/'} 
            />
            <NavItem 
              href="/papers" 
              icon={<PaperIcon className="w-5 h-5" />} 
              label="My Papers" 
              isActive={location === '/papers'} 
            />
            <NavItem 
              href="/search" 
              icon={<SearchIcon className="w-5 h-5" />} 
              label="Search" 
              isActive={location === '/search'} 
            />
            <NavItem 
              href="/ai-assistant" 
              icon={<ChatIcon className="w-5 h-5" />} 
              label="AI Assistant" 
              isActive={location === '/ai-assistant'} 
            />
            <NavItem 
              href="/citation-graph" 
              icon={<GraphIcon className="w-5 h-5" />} 
              label="Citation Graph" 
              isActive={location === '/citation-graph'} 
            />
          </ul>
        </div>
        
        <div className="px-3 md:px-4 mt-6">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider hidden md:block mb-2">Tools</div>
          <ul>
            <NavItem 
              href="/compare-papers" 
              icon={<CompareIcon className="w-5 h-5" />} 
              label="Compare Papers" 
              isActive={location === '/compare-papers'} 
            />
            <NavItem 
              href="/annotations" 
              icon={<BookmarkIcon className="w-5 h-5" />} 
              label="Annotations" 
              isActive={location === '/annotations'} 
            />
            <NavItem 
              href="/plagiarism-checker" 
              icon={<i className="ri-shield-check-line w-5 h-5" />} 
              label="Plagiarism Checker" 
              isActive={location === '/plagiarism-checker'} 
            />
            <NavItem 
              href="/document-analyzer" 
              icon={<i className="ri-file-search-line w-5 h-5" />} 
              label="Document Analyzer" 
              isActive={location === '/document-analyzer'} 
            />
            <NavItem 
              href="/citation-generator" 
              icon={<i className="ri-links-line w-5 h-5" />} 
              label="Citation Generator" 
              isActive={location === '/citation-generator'} 
            />
            <NavItem 
              href="/literature-review" 
              icon={<BookOpen className="w-5 h-5" />} 
              label="Literature Review" 
              isActive={location === '/literature-review'} 
            />
            <NavItem 
              href="/research-collaboration" 
              icon={<Users className="w-5 h-5" />} 
              label="Collaboration" 
              isActive={location === '/research-collaboration'} 
            />
            <NavItem 
              href="/smart-reference-manager" 
              icon={<BookmarkLucide className="w-5 h-5" />} 
              label="Reference Manager" 
              isActive={location === '/smart-reference-manager'} 
            />
            <NavItem 
              href="/academic-writing-assistant" 
              icon={<PenLine className="w-5 h-5" />} 
              label="Writing Assistant" 
              isActive={location === '/academic-writing-assistant'} 
            />
            <NavItem 
              href="/research-trend-analyzer" 
              icon={<BarChart2 className="w-5 h-5" />} 
              label="Trend Analyzer" 
              isActive={location === '/research-trend-analyzer'} 
            />
            <NavItem 
              href="/journal-recommender" 
              icon={<BookCopy className="w-5 h-5" />} 
              label="Journal Recommender" 
              isActive={location === '/journal-recommender'} 
            />
            <NavItem 
              href="/peer-review-simulator" 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="Peer Review Simulator" 
              isActive={location === '/peer-review-simulator'} 
            />
            <NavItem 
              href="/visual-abstract-creator" 
              icon={<Image className="w-5 h-5" />} 
              label="Visual Abstract Creator" 
              isActive={location === '/visual-abstract-creator'} 
            />
            <NavItem 
              href="/export" 
              icon={<ExportIcon className="w-5 h-5" />} 
              label="Export Options" 
              isActive={location === '/export'} 
            />
          </ul>
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium">Sarah Chen</p>
            <p className="text-xs text-neutral-500">PhD Researcher</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
