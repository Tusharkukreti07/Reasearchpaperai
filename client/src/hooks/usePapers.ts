import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Paper {
  id: number;
  userId: number;
  title: string;
  authors: string;
  abstract: string;
  content: string;
  uploadDate: string;
  filename: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  metadata: any;
  isProcessed: boolean;
  contentPreview?: string;
}

interface Summary {
  id: number;
  paperId: number;
  bulletPoints: string;
  sectionWise: Record<string, string>;
  createdAt: string;
}

interface Citation {
  id: number;
  paperId: number;
  citedTitle: string;
  citedAuthors: string;
  citedYear: string;
  citedDoi?: string;
  citationText: string;
  createdAt: string;
}

export function usePapers() {
  return useQuery<Paper[]>({
    queryKey: ['/api/papers'],
  });
}

export function usePaper(id: number | null) {
  return useQuery<Paper>({
    queryKey: id ? [`/api/papers/${id}`] : null,
    enabled: !!id,
  });
}

export function usePaperSummary(paperId: number | null) {
  return useQuery<Summary>({
    queryKey: paperId ? [`/api/papers/${paperId}/summary`] : null,
    enabled: !!paperId,
  });
}

export function usePaperCitations(paperId: number | null) {
  return useQuery<Citation[]>({
    queryKey: paperId ? [`/api/papers/${paperId}/citations`] : null,
    enabled: !!paperId,
  });
}

export function useFormatCitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ citation, style }: { 
      citation: {
        title: string;
        authors: string;
        year: string;
        journal?: string;
        volume?: string;
        issue?: string;
        pages?: string;
        doi?: string;
      }, 
      style: 'APA' | 'MLA' | 'Chicago' | 'BibTeX'
    }) => {
      const response = await apiRequest('POST', '/api/citations/format', {
        ...citation,
        style
      });
      return response.json();
    }
  });
}

export function useComparePapers() {
  return useMutation({
    mutationFn: async (paperIds: number[]) => {
      const response = await apiRequest('POST', '/api/papers/compare', {
        paperIds
      });
      return response.json();
    }
  });
}

export function useGenerateLiteratureReview() {
  return useMutation({
    mutationFn: async (paperIds: number[]) => {
      const response = await apiRequest('POST', '/api/literature-review', {
        paperIds
      });
      return response.json();
    }
  });
}

export function usePaperAnnotations(paperId: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: paperId ? [`/api/papers/${paperId}/annotations`] : null,
    enabled: !!paperId,
  });

  const createAnnotation = useMutation({
    mutationFn: async ({ 
      paperId, 
      userId, 
      pageNumber, 
      content, 
      highlightedText, 
      position 
    }: {
      paperId: number;
      userId: number;
      pageNumber: number;
      content: string;
      highlightedText?: string;
      position?: any;
    }) => {
      const response = await apiRequest('POST', '/api/annotations', {
        paperId,
        userId,
        pageNumber,
        content,
        highlightedText,
        position
      });
      return response.json();
    },
    onSuccess: () => {
      if (paperId) {
        queryClient.invalidateQueries({ queryKey: [`/api/papers/${paperId}/annotations`] });
      }
    }
  });

  return {
    annotations: query.data,
    isLoading: query.isLoading,
    createAnnotation
  };
}
