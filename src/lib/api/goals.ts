import { backend } from '../backend';
import { GoalData } from '../types';

export async function createOrUpdateGoal(amount: string) {
  const response = await backend.post('/goals', { amount });
  return response.data;
}

export async function fetchGoalData() {
  const response = await backend.get<GoalData>('/goals');
  return response.data;
}
