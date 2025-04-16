import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ResearchGoal {
  id: number;
  userId: number;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  completedDate?: string;
  createdAt: string;
}

export function useResearchGoals() {
  const queryClient = useQueryClient();

  const goalsQuery = useQuery<ResearchGoal[]>({
    queryKey: ['/api/research-goals'],
  });

  const createGoal = useMutation({
    mutationFn: async ({ description, dueDate }: { description: string; dueDate?: Date }) => {
      const response = await apiRequest('POST', '/api/research-goals', {
        userId: 1, // Using demo user ID
        description,
        dueDate: dueDate?.toISOString(),
        isCompleted: false
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research-goals'] });
    },
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, isCompleted, description, dueDate }: { 
      id: number;
      isCompleted?: boolean;
      description?: string;
      dueDate?: Date;
    }) => {
      const payload: Record<string, any> = {};
      if (isCompleted !== undefined) payload.isCompleted = isCompleted;
      if (description !== undefined) payload.description = description;
      if (dueDate !== undefined) payload.dueDate = dueDate.toISOString();
      
      if (isCompleted) {
        payload.completedDate = new Date().toISOString();
      }
      
      const response = await apiRequest('PATCH', `/api/research-goals/${id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research-goals'] });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/research-goals/${id}`, undefined);
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research-goals'] });
    },
  });

  return {
    goals: goalsQuery.data || [],
    isLoading: goalsQuery.isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
