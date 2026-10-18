import { toUser } from '@/lib/api/auth';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  useEffect(() => {
    // Fires with the stored session on load, then on sign-in, sign-out and token refresh.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? toUser(session.user) : undefined);
      setIsAuthenticated(session !== null);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { user, isAuthenticated };
}
