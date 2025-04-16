import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PaperCard from '@/components/dashboard/PaperCard';
import { SearchIcon } from '@/lib/icons';

interface Paper {
  id: number;
  title: string;
  authors: string;
  uploadDate: Date;
  tags: string[];
}

interface PapersListProps {
  papers: Paper[];
  title?: string;
  showSearch?: boolean;
}

const PapersList: React.FC<PapersListProps> = ({
  papers,
  title = "Recent Papers",
  showSearch = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPapers = searchQuery
    ? papers.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : papers;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                className="pl-9 pr-4 w-64"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          {papers.length > 3 && !searchQuery && (
            <Button variant="link" className="text-primary-600 hover:underline flex items-center p-0">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          )}
        </div>
      </div>
      
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <PaperCard
              key={paper.id}
              id={paper.id}
              title={paper.title}
              authors={paper.authors}
              uploadDate={paper.uploadDate}
              tags={paper.tags}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-500 mb-2">No papers found</p>
          <p className="text-sm text-neutral-400">
            {searchQuery 
              ? "Try adjusting your search terms" 
              : "Upload papers to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PapersList;
