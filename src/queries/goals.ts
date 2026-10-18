import { createOrUpdateGoal, fetchGoalData } from '@/lib/api/goals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const goalKeys = {
  all: ['goals'] as const,
};

export function useGoal() {
  return useQuery({ queryKey: goalKeys.all, queryFn: fetchGoalData });
}

export function useSaveGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalKeys.all }),
  });
}
