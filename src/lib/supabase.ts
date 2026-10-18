import { createClient, FunctionsHttpError } from '@supabase/supabase-js';
import type { Database } from './database.types';

// The browser client signs in as the user, so every query below runs under row-level
// security. It stores the session in localStorage and refreshes it automatically.
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
);

export async function requireUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Not signed in');
  return data.session.user.id;
}

/** Rows come back at PostgREST's default page size, so page through big result sets. */
export async function fetchAllPages<T>(
  page: (from: number, to: number) => PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>,
  pageSize = 1000
) {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await page(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return rows;
  }
}

/**
 * Calls an Edge Function and returns its JSON body. A non-2xx response throws an Error
 * carrying the function's `detail` message, which is fit to show the user.
 */
export async function invokeFunction<T>(name: string, body: object) {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (!error) return data as T;
  if (error instanceof FunctionsHttpError) {
    const problem = await error.context.json().catch(() => null);
    if (typeof problem?.detail === 'string') throw new Error(problem.detail);
  }
  throw error;
}
