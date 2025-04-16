import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PapersList from '@/components/papers/PapersList';
import { usePapers } from '@/hooks/usePapers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, UploadIcon } from '@/lib/icons';
import UploadModal from '@/components/papers/UploadModal';

const Papers: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: papers, isLoading } = usePapers();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter papers based on search query
  const filteredPapers = papers && searchQuery 
    ? papers.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (paper.authors && paper.authors.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (paper.abstract && paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : papers;
  
  // Group papers by tags
  const papersByTag = new Map<string, typeof papers>();
  if (papers) {
    papers.forEach(paper => {
      if (paper.tags && paper.tags.length > 0) {
        paper.tags.forEach(tag => {
          if (!papersByTag.has(tag)) {
            papersByTag.set(tag, []);
          }
          papersByTag.get(tag)?.push(paper);
        });
      }
    });
  }
  
  // Group papers by date
  const papersByDate = new Map<string, typeof papers>();
  if (papers) {
    papers.forEach(paper => {
      const date = new Date(paper.uploadDate);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      if (!papersByDate.has(key)) {
        papersByDate.set(key, []);
      }
      papersByDate.get(key)?.push(paper);
    });
  }
  
  return (
    <Layout title="My Papers">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            className="pl-9 pr-4"
            placeholder="Search papers by title, author, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload Papers
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Papers</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="by-tag">By Tag</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PapersList
            papers={isLoading ? [] : (filteredPapers || []).map(paper => ({
              id: paper.id,
              title: paper.title,
              authors: paper.authors || 'Unknown',
              uploadDate: new Date(paper.uploadDate),
              tags: paper.tags || []
            }))}
            title={searchQuery ? `Search Results (${filteredPapers?.length || 0})` : "All Papers"}
          />
        </TabsContent>
        
        <TabsContent value="recent">
          {Array.from(papersByDate.entries()).map(([dateKey, datePapers]) => (
            <div key={dateKey} className="mb-8">
              <h3 className="font-semibold text-lg mb-4">{dateKey}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datePapers?.map(paper => (
                  <div key={paper.id} className="space-y-2">
                    <h4 className="font-medium truncate">{paper.title}</h4>
                    <p className="text-sm text-neutral-500 truncate">{paper.authors || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="by-tag">
          {Array.from(papersByTag.entries()).map(([tag, tagPapers]) => (
            <div key={tag} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-100 text-primary-800 font-medium px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
                <span className="text-neutral-500 text-sm">
                  {tagPapers?.length} papers
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tagPapers?.map(paper => (
                  <div key={paper.id} className="space-y-2">
                    <h4 className="font-medium truncate">{paper.title}</h4>
                    <p className="text-sm text-neutral-500 truncate">{paper.authors || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
      
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </Layout>
  );
};

export default Papers;
