import { queryKeys } from './keys';
import { createOrUpdateGoal, fetchGoalData } from '@/lib/api/goals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGoal() {
  return useQuery({
    queryKey: queryKeys.goals.current.queryKey,
    queryFn: fetchGoalData,
  });
}

export function useSaveGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateGoal,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.goals._def }),
  });
}
