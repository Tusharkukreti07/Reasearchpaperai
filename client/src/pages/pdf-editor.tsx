import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PDFEditor from '@/components/pdf/PDFEditor';
import { useParams, useLocation } from 'wouter';
import { usePaper } from '@/hooks/usePapers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { PaperIcon, EditIcon } from '@/lib/icons';

const PDFEditorPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const paperId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { data: paper, isLoading, error } = usePaper(paperId);
  const [isSaving, setIsSaving] = useState(false);

  // Handle saving the edited PDF
  const handleSavePDF = async (editedPdf: File) => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would call an API to save the edited PDF
      // For this mock, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Success',
        description: 'PDF saved successfully',
      });
      
      // Navigate back to the paper details
      navigate(`/papers/${paperId}`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to save PDF',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="PDF Editor">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </Layout>
    );
  }

  if (error || !paper) {
    return (
      <Layout title="PDF Editor">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <i className="ri-error-warning-line text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading Paper</h3>
            <p className="text-neutral-600 mb-4 text-center">
              We couldn't load the requested paper. It may have been deleted or you may not have permission to access it.
            </p>
            <Button onClick={() => navigate('/papers')}>
              Back to Papers
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title={`Editing: ${paper.title}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-primary-50 p-2 text-primary-600">
            <EditIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{paper.title}</h1>
            <p className="text-sm text-neutral-500">
              {paper.authors || 'Unknown authors'}
            </p>
          </div>
        </div>
        
        <Button variant="outline" onClick={() => navigate(`/papers/${paperId}`)}>
          Cancel Editing
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[calc(100vh-220px)]">
            <PDFEditor
              pdfUrl={`/api/papers/${paperId}/pdf`}
              paperId={paperId}
              onSave={handleSavePDF}
            />
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PDFEditorPage;