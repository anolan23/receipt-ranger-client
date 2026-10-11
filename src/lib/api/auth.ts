import axios from 'axios';
import { tokenStorage } from '../token-storage';
import { Credentials, User } from '../types';

// Plain client with no interceptors: auth calls must not trigger refresh-on-401.
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

type TokenResponse = { access_token: string; refresh_token: string };

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'detail' in data) {
      return String(data.detail);
    }
    if (error.response?.status === 401) return 'Incorrect email or password';
    if (error.response?.status === 429)
      return 'Too many attempts, please try again later';
    if (!error.response) return 'Unable to reach the server';
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}

export async function register({ email, password }: Credentials) {
  const { data } = await authClient.post<TokenResponse & { user: User }>(
    '/auth/register',
    { email, password }
  );
  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data.user;
}

export async function login({ email, password }: Credentials) {
  const { data } = await authClient.post<TokenResponse>('/auth/login', {
    email,
    password,
  });
  tokenStorage.setTokens(data.access_token, data.refresh_token);
}

let refreshPromise: Promise<string> | null = null;

/** Refreshes the access token. Concurrent callers share one request. */
export function refresh(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return Promise.reject(new Error('No refresh token'));
    refreshPromise = authClient
      .post<{ access_token: string }>('/auth/refresh', undefined, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then(({ data }) => {
        tokenStorage.setAccessToken(data.access_token);
        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function logout() {
  tokenStorage.clear();
}

export async function getCurrentUser() {
  const fetchMe = (token: string | null) =>
    authClient.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  try {
    return (await fetchMe(tokenStorage.getAccessToken())).data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }
    return (await fetchMe(await refresh())).data;
  }
}
