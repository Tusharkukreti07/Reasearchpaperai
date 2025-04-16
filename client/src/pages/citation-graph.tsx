import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CitationGraph from '@/components/dashboard/CitationGraph';
import { usePapers } from '@/hooks/usePapers';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GraphIcon, SearchIcon } from '@/lib/icons';

interface Node {
  id: string;
  title: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
}

const CitationGraphPage: React.FC = () => {
  const { data: papers, isLoading } = usePapers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('all');
  const [graphData, setGraphData] = useState<{ nodes: Node[], links: Link[] }>({
    nodes: [],
    links: []
  });
  
  // Generate graph data from papers
  useEffect(() => {
    if (!papers || papers.length === 0) return;
    
    const nodes: Node[] = [];
    const links: Link[] = [];
    const paperMap = new Map<number, typeof papers[0]>();
    
    // Create nodes for all papers
    papers.forEach(paper => {
      paperMap.set(paper.id, paper);
      nodes.push({
        id: paper.id.toString(),
        title: paper.title,
        group: 1
      });
    });
    
    // Create links based on citations
    // In a real application, this would use the citation data from the backend
    // For now, we'll create some random connections for demonstration
    papers.forEach(paper => {
      // Random number of connections (0-3)
      const numConnections = Math.floor(Math.random() * 4);
      const paperIds = papers.map(p => p.id).filter(id => id !== paper.id);
      
      for (let i = 0; i < numConnections && paperIds.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * paperIds.length);
        const targetId = paperIds[randomIndex];
        
        links.push({
          source: paper.id.toString(),
          target: targetId.toString()
        });
        
        // Remove this paper so we don't connect to it again
        paperIds.splice(randomIndex, 1);
      }
    });
    
    setGraphData({ nodes, links });
  }, [papers]);
  
  // Filter graph based on selectedPaperId
  const filteredGraph = React.useMemo(() => {
    if (selectedPaperId === 'all') return graphData;
    
    // Keep only the selected paper and its direct connections
    const relatedLinks = graphData.links.filter(
      link => link.source === selectedPaperId || link.target === selectedPaperId
    );
    
    const nodeIds = new Set<string>([selectedPaperId]);
    relatedLinks.forEach(link => {
      nodeIds.add(link.source);
      nodeIds.add(link.target);
    });
    
    const relatedNodes = graphData.nodes.filter(node => nodeIds.has(node.id));
    
    return {
      nodes: relatedNodes,
      links: relatedLinks
    };
  }, [graphData, selectedPaperId]);
  
  return (
    <Layout title="Citation Graph">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Citation Network</h1>
          <p className="text-neutral-600">
            Visualize the relationships between your papers and their citations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              className="pl-9 pr-4"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedPaperId}
            onValueChange={setSelectedPaperId}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by paper" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Papers</SelectItem>
              {papers && papers.map(paper => (
                <SelectItem key={paper.id} value={paper.id.toString()}>
                  {paper.title.length > 20 ? `${paper.title.substring(0, 20)}...` : paper.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="graph" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph">
          <Card className="overflow-hidden">
            <div className="h-[calc(100vh-300px)] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-neutral-500">Loading citation graph...</p>
                </div>
              ) : filteredGraph.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <GraphIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 mb-2">No citation data available</p>
                    <p className="text-sm text-neutral-400">
                      Upload papers with citations to generate a graph
                    </p>
                  </div>
                </div>
              ) : (
                <CitationGraph
                  nodes={filteredGraph.nodes}
                  links={filteredGraph.links}
                  height={600}
                  title={selectedPaperId === 'all' 
                    ? "Full Citation Network" 
                    : "Paper Citation Network"
                  }
                />
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {isLoading ? (
                  <p className="text-neutral-500">Loading citation data...</p>
                ) : papers && papers.length > 0 ? (
                  papers.map(paper => {
                    // Find all papers that cite this paper
                    const citedBy = filteredGraph.links
                      .filter(link => link.target === paper.id.toString())
                      .map(link => filteredGraph.nodes.find(node => node.id === link.source))
                      .filter(Boolean);
                    
                    // Find all papers cited by this paper
                    const cites = filteredGraph.links
                      .filter(link => link.source === paper.id.toString())
                      .map(link => filteredGraph.nodes.find(node => node.id === link.target))
                      .filter(Boolean);
                    
                    return (
                      <div key={paper.id} className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
                        <p className="text-sm text-neutral-600 mb-4">{paper.authors || 'Unknown authors'}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <span className="mr-2">Cited by</span>
                              <Badge variant="outline">{citedBy.length}</Badge>
                            </h4>
                            {citedBy.length > 0 ? (
                              <ul className="space-y-1">
                                {citedBy.map((node: any) => (
                                  <li key={node.id} className="text-sm text-neutral-600">
                                    • {node.title}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-neutral-500">No citations found</p>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <span className="mr-2">Cites</span>
                              <Badge variant="outline">{cites.length}</Badge>
                            </h4>
                            {cites.length > 0 ? (
                              <ul className="space-y-1">
                                {cites.map((node: any) => (
                                  <li key={node.id} className="text-sm text-neutral-600">
                                    • {node.title}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-neutral-500">No citations found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <GraphIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 mb-2">No papers available</p>
                    <p className="text-sm text-neutral-400 mb-4">
                      Upload papers to see their citation data
                    </p>
                    <Button>Upload Papers</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default CitationGraphPage;
