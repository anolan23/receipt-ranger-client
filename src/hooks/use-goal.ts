import { fetchGoalData } from '@/lib/api/goals';
import useSWR from 'swr';

export function useGoal() {
  return useSWR('/goals', fetchGoalData);
}
