import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="bg-neutral-100 text-neutral-800 flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title={title} />
        
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
