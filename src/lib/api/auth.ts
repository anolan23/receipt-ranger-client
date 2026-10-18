import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { Credentials, User } from '../types';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.code === 'invalid_credentials') return 'Incorrect email or password';
    if (error.code === 'user_already_exists') return 'That email is already registered';
    if (error.status === 429) return 'Too many attempts, please try again later';
    if (error.name === 'AuthRetryableFetchError') return 'Unable to reach the server';
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}

export async function register({ email, password }: Credentials) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.session) {
    // Email confirmation is on, so there is no session until the link is clicked.
    throw new Error('Check your email to confirm your account, then log in.');
  }
  return toUser(data.session.user);
}

export async function login({ email, password }: Credentials) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return toUser(data.user);
}

export function toUser(user: {
  id: string;
  email?: string;
  created_at: string;
  updated_at?: string;
}): User {
  return {
    id: user.id,
    email: user.email ?? '',
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
  };
}
