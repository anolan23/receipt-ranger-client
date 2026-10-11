import { getCurrentUser } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/token-storage';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  useEffect(() => {
    const start = async () => {
      if (!tokenStorage.getRefreshToken()) {
        setIsAuthenticated(false);
        return;
      }
      try {
        setUser(await getCurrentUser());
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    start();
  }, []);
  return { user, isAuthenticated };
}
