import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  extractText: boolean;
  generateSummary: boolean;
  extractCitations: boolean;
}

export function useUploadPapers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload paper');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/papers'] });
      toast({
        title: 'Upload Successful',
        description: 'Your paper has been uploaded and is being processed.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const uploadPapers = async (files: File[], options: UploadOptions) => {
    setIsUploading(true);
    
    // Process files one by one
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add options as additional form fields if needed
        if (!options.extractText) formData.append('extractText', 'false');
        if (!options.generateSummary) formData.append('generateSummary', 'false');
        if (!options.extractCitations) formData.append('extractCitations', 'false');
        
        await uploadMutation.mutateAsync(formData);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
  };

  return {
    uploadPapers,
    isUploading,
  };
}
