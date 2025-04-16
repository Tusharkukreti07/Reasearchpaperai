import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  paperCount: number;
  citationCount: number;
  queryCount: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });
}
