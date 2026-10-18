import { requireUserId, supabase } from '../supabase';
import { GoalData } from '../types';
import { money } from './mappers';

function toGoal(row: Omit<GoalData, 'amount'> & { amount: number }): GoalData {
  return { ...row, amount: money(row.amount) as string };
}

export async function createOrUpdateGoal(amount: string) {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('goals')
    .upsert({ user_id: userId, amount: Number(amount) }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toGoal(data as never);
}

/** The user's monthly goal, or null if they haven't set one. */
export async function fetchGoalData() {
  const { data, error } = await supabase.from('goals').select('*').maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toGoal(data as never) : null;
}
