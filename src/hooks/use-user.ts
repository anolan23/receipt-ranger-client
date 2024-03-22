import { AuthUser, getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<AuthUser>();
  useEffect(() => {
    const start = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    start();
  }, []);
  return { user };
}
