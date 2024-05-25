import {
  AuthUser,
  fetchUserAttributes,
  getCurrentUser,
} from 'aws-amplify/auth';
import { useEffect, useLayoutEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<AuthUser>();
  const [userAttributes, setUserAttributes] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  useLayoutEffect(() => {
    const start = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    start();
  }, []);
  return { user, isAuthenticated };
}
