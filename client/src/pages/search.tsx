import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { usePapers } from '@/hooks/usePapers';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PaperIcon, UserIcon, CalendarIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

const Search: React.FC = () => {
  const { data: papers, isLoading } = usePapers();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('semantic');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    authors: [] as string[],
    date: {
      from: '',
      to: ''
    },
    tags: [] as string[]
  });
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Basic filtering based on search query
      // In a real implementation, this would call the backend API for semantic search
      const results = papers?.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (paper.content && paper.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (paper.abstract && paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (paper.authors && paper.authors.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || [];
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };
  
  // Extract all unique authors from papers
  const allAuthors = React.useMemo(() => {
    if (!papers) return [];
    
    const authorsSet = new Set<string>();
    papers.forEach(paper => {
      if (paper.authors) {
        // Split authors by common separators and trim
        paper.authors.split(/[,;&]/).forEach(author => {
          const trimmed = author.trim();
          if (trimmed) authorsSet.add(trimmed);
        });
      }
    });
    
    return Array.from(authorsSet);
  }, [papers]);
  
  // Extract all unique tags from papers
  const allTags = React.useMemo(() => {
    if (!papers) return [];
    
    const tagsSet = new Set<string>();
    papers.forEach(paper => {
      if (paper.tags) {
        paper.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet);
  }, [papers]);
  
  // Toggle author filter
  const toggleAuthorFilter = (author: string) => {
    setFilters(prev => ({
      ...prev,
      authors: prev.authors.includes(author) 
        ? prev.authors.filter(a => a !== author)
        : [...prev.authors, author]
    }));
  };
  
  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  
  // Apply filters to search results
  const filteredResults = React.useMemo(() => {
    if (!searchResults.length) return [];
    
    return searchResults.filter(paper => {
      // Filter by authors
      if (filters.authors.length > 0) {
        if (!paper.authors) return false;
        
        const hasMatchingAuthor = filters.authors.some(author => 
          paper.authors.toLowerCase().includes(author.toLowerCase())
        );
        
        if (!hasMatchingAuthor) return false;
      }
      
      // Filter by date range
      if (filters.date.from || filters.date.to) {
        const paperDate = new Date(paper.uploadDate);
        
        if (filters.date.from) {
          const fromDate = new Date(filters.date.from);
          if (paperDate < fromDate) return false;
        }
        
        if (filters.date.to) {
          const toDate = new Date(filters.date.to);
          if (paperDate > toDate) return false;
        }
      }
      
      // Filter by tags
      if (filters.tags.length > 0) {
        if (!paper.tags || paper.tags.length === 0) return false;
        
        const hasMatchingTag = filters.tags.some(tag => 
          paper.tags.includes(tag)
        );
        
        if (!hasMatchingTag) return false;
      }
      
      return true;
    });
  }, [searchResults, filters]);
  
  return (
    <Layout title="Search">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl">
          <div className="relative md:col-span-3">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              className="pl-10 pr-4 py-6 text-lg"
              placeholder="Search papers, content, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="h-full">
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
            <TabsTrigger value="fulltext">Full-Text Search</TabsTrigger>
          </TabsList>
          <p className="text-sm text-neutral-500 mt-2">
            {activeTab === 'semantic' 
              ? 'Semantic search understands the meaning of your query, not just keywords'
              : 'Full-text search looks for exact keyword matches in paper content'
            }
          </p>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              
              <div className="space-y-6">
                {/* Authors filter */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Authors</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {allAuthors.length > 0 ? (
                      allAuthors.map((author, index) => (
                        <div key={index} className="flex items-center">
                          <Checkbox
                            id={`author-${index}`}
                            checked={filters.authors.includes(author)}
                            onCheckedChange={() => toggleAuthorFilter(author)}
                          />
                          <Label htmlFor={`author-${index}`} className="ml-2 text-sm font-normal cursor-pointer">
                            {author}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500">No authors found</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Date filter */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date-from" className="text-xs">From</Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={filters.date.from}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          date: { ...prev.date, from: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to" className="text-xs">To</Label>
                      <Input
                        id="date-to"
                        type="date"
                        value={filters.date.to}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          date: { ...prev.date, to: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Tags filter */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.length > 0 ? (
                      allTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant={filters.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500">No tags found</p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({
                    authors: [],
                    date: { from: '', to: '' },
                    tags: []
                  })}
                  disabled={filters.authors.length === 0 && 
                            !filters.date.from && 
                            !filters.date.to && 
                            filters.tags.length === 0}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {isSearching ? (
            <Card className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <SearchIcon className="w-8 h-8 text-neutral-300 mb-3" />
                <p className="text-neutral-500">Searching papers...</p>
              </div>
            </Card>
          ) : searchQuery && filteredResults.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredResults.map(paper => (
                  <Card key={paper.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 hover:bg-neutral-50">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-neutral-100 p-3 border border-neutral-200">
                            <PaperIcon className="w-6 h-6 text-neutral-500" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1">
                              <a href={`/papers/${paper.id}`} className="text-primary-600 hover:underline">
                                {paper.title}
                              </a>
                            </h3>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500 mb-3">
                              {paper.authors && (
                                <div className="flex items-center">
                                  <UserIcon className="w-4 h-4 mr-1" />
                                  <span>{paper.authors}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span>{formatDate(paper.uploadDate)}</span>
                              </div>
                            </div>
                            
                            {paper.abstract && (
                              <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                                {paper.abstract}
                              </p>
                            )}
                            
                            {paper.tags && paper.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {paper.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <Card className="p-8 text-center">
              <SearchIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-neutral-400">
                Try adjusting your search terms or filters
              </p>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <SearchIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="font-medium text-lg mb-2">Search Your Research Papers</p>
              <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                Find papers by content, authors, or keywords. You can use natural language queries with semantic search.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setSearchQuery('neural networks')}>
                  "neural networks"
                </Button>
                <Button variant="outline" onClick={() => setSearchQuery('methods for time series analysis')}>
                  "methods for time series"
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
