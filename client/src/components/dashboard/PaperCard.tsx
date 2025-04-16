import React from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { PDFIcon, UserIcon, CalendarIcon } from '@/lib/icons';

interface PaperCardProps {
  id: number;
  title: string;
  authors: string;
  uploadDate: Date;
  tags: string[];
}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  title,
  authors,
  uploadDate,
  tags
}) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
      {/* Paper Preview */}
      <div className="h-32 bg-neutral-100 border-b border-neutral-200 flex items-center justify-center px-4">
        <div className="p-4">
          <div className="w-16 h-20 mx-auto bg-white rounded-md shadow flex items-center justify-center">
            <PDFIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-3 bg-neutral-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
        </div>
      </div>
      
      {/* Paper Info */}
      <div className="p-4">
        <h4 className="font-semibold text-neutral-800 mb-2 line-clamp-2">{title}</h4>
        <div className="flex items-center text-xs text-neutral-500 mb-2">
          <UserIcon className="w-3 h-3 mr-1" />
          <span>{authors}</span>
        </div>
        <div className="flex items-center text-xs text-neutral-500 mb-3">
          <CalendarIcon className="w-3 h-3 mr-1" />
          <span>Uploaded: {formatDate(uploadDate)}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-primary-50 text-primary-700 rounded-full px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
          <div className="flex space-x-2">
            <button className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
              <i className="ri-chat-1-line"></i>
            </button>
            <button className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
              <i className="ri-bookmark-line"></i>
            </button>
            <button className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
              <i className="ri-share-forward-line"></i>
            </button>
          </div>
          <Link href={`/papers/${id}`}>
            <Button variant="link" className="text-primary-600 hover:text-primary-700 font-medium p-0">
              Open
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PaperCard;
