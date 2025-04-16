import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadIcon, NotificationIcon, SettingsIcon } from '@/lib/icons';
import UploadModal from '@/components/papers/UploadModal';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  return (
    <>
      <header className="border-b border-neutral-200 bg-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-5">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            <span>Upload Papers</span>
          </Button>
          
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-neutral-100">
              <NotificationIcon className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <SettingsIcon className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </header>
      
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </>
  );
};

export default Header;
