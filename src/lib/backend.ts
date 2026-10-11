import axios, { InternalAxiosRequestConfig } from 'axios';
import { refresh, logout } from './api/auth';
import { tokenStorage } from './token-storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const backend = axios.create({
  baseURL: API_BASE_URL,
});

backend.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

backend.interceptors.response.use(undefined, async (error) => {
  const config: RetriableConfig | undefined = error.config;
  if (error.response?.status !== 401 || !config || config._retried) {
    return Promise.reject(error);
  }
  config._retried = true;
  try {
    const accessToken = await refresh();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return backend(config);
  } catch {
    logout();
    window.location.assign('/');
    return Promise.reject(error);
  }
});
