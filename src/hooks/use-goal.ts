import { fetchGoalData } from '@/lib/api/goals';
import { useQuery } from '@tanstack/react-query';

export function useGoal() {
  return useQuery({ queryKey: ['goals'], queryFn: fetchGoalData });
}
