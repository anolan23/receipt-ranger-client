const ACCESS_KEY = 'rr_access_token';
const REFRESH_KEY = 'rr_refresh_token';

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // storage unavailable; session will not persist
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_KEY),
  getRefreshToken: () => read(REFRESH_KEY),
  setAccessToken: (token: string) => write(ACCESS_KEY, token),
  setTokens: (accessToken: string, refreshToken: string) => {
    write(ACCESS_KEY, accessToken);
    write(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    write(ACCESS_KEY, null);
    write(REFRESH_KEY, null);
  },
};
