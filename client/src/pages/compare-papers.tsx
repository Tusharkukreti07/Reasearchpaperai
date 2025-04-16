import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { usePapers, useComparePapers } from '@/hooks/usePapers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { CompareIcon } from '@/lib/icons';

interface PaperComparisonResult {
  aims: Record<string, string>;
  datasets: Record<string, string>;
  methods: Record<string, string>;
  results: Record<string, string>;
  conclusions: Record<string, string>;
  similarities: string[];
  differences: string[];
}

const ComparePapers: React.FC = () => {
  const { data: papers, isLoading } = usePapers();
  const comparePapersMutation = useComparePapers();
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const [comparisonResult, setComparisonResult] = useState<PaperComparisonResult | null>(null);
  
  const handlePaperToggle = (paperId: number) => {
    setSelectedPaperIds(prev => 
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };
  
  const handleCompare = async () => {
    if (selectedPaperIds.length < 2) {
      return;
    }
    
    try {
      const result = await comparePapersMutation.mutateAsync(selectedPaperIds);
      setComparisonResult(result);
    } catch (error) {
      console.error('Error comparing papers:', error);
    }
  };
  
  const selectedPapers = papers?.filter(paper => selectedPaperIds.includes(paper.id)) || [];
  
  return (
    <Layout title="Compare Papers">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CompareIcon className="w-5 h-5 mr-2" />
                Select Papers to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-neutral-500">Loading papers...</p>
              ) : papers && papers.length > 0 ? (
                <div className="space-y-2">
                  {papers.map(paper => (
                    <div key={paper.id} className="flex items-start">
                      <Checkbox 
                        id={`compare-paper-${paper.id}`}
                        checked={selectedPaperIds.includes(paper.id)}
                        onCheckedChange={() => handlePaperToggle(paper.id)}
                        className="mt-0.5 mr-2"
                      />
                      <Label 
                        htmlFor={`compare-paper-${paper.id}`}
                        className="text-sm font-normal cursor-pointer line-clamp-2"
                      >
                        {paper.title}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No papers available. Upload some papers first.</p>
              )}
              
              <div className="mt-6">
                <Button 
                  onClick={handleCompare} 
                  disabled={selectedPaperIds.length < 2 || comparePapersMutation.isPending}
                  className="w-full"
                >
                  {comparePapersMutation.isPending 
                    ? 'Comparing...' 
                    : `Compare ${selectedPaperIds.length} Papers`}
                </Button>
                
                {selectedPaperIds.length < 2 && (
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Select at least 2 papers to compare
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {selectedPapers.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Selected Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedPapers.map((paper, index) => (
                    <li key={paper.id} className="flex items-start">
                      <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{paper.title}</p>
                        <p className="text-xs text-neutral-500">{paper.authors || 'Unknown'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          {comparisonResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="table">
                  <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="similarities">Similarities</TabsTrigger>
                    <TabsTrigger value="differences">Differences</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32"></TableHead>
                          {selectedPapers.map((paper, index) => (
                            <TableHead key={paper.id}>
                              Paper {index + 1}: {paper.title.length > 20 
                                ? `${paper.title.substring(0, 20)}...` 
                                : paper.title}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Research Aims</TableCell>
                          {selectedPapers.map((paper, index) => (
                            <TableCell key={paper.id}>
                              {comparisonResult.aims[`Paper ${index + 1}`] || 'Not specified'}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Datasets</TableCell>
                          {selectedPapers.map((paper, index) => (
                            <TableCell key={paper.id}>
                              {comparisonResult.datasets[`Paper ${index + 1}`] || 'Not specified'}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Methods</TableCell>
                          {selectedPapers.map((paper, index) => (
                            <TableCell key={paper.id}>
                              {comparisonResult.methods[`Paper ${index + 1}`] || 'Not specified'}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Results</TableCell>
                          {selectedPapers.map((paper, index) => (
                            <TableCell key={paper.id}>
                              {comparisonResult.results[`Paper ${index + 1}`] || 'Not specified'}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Conclusions</TableCell>
                          {selectedPapers.map((paper, index) => (
                            <TableCell key={paper.id}>
                              {comparisonResult.conclusions[`Paper ${index + 1}`] || 'Not specified'}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="similarities">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Similarities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.similarities.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.similarities.map((similarity, index) => (
                              <li key={index} className="flex">
                                <span className="text-green-500 mr-2">•</span>
                                <span>{similarity}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-neutral-500">No significant similarities found.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="differences">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Differences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.differences.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.differences.map((difference, index) => (
                              <li key={index} className="flex">
                                <span className="text-red-500 mr-2">•</span>
                                <span>{difference}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-neutral-500">No significant differences found.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white p-12 rounded-lg border border-neutral-200 max-w-lg">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CompareIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Compare Research Papers</h3>
                <p className="text-neutral-600 mb-6">
                  Select multiple papers from the sidebar to see a detailed comparison of their aims, methods, results, and conclusions.
                </p>
                <p className="text-sm text-neutral-500">
                  AI will analyze the papers and highlight similarities and differences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ComparePapers;
