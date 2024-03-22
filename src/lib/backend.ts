import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const backend = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor
backend.interceptors.request.use(async (config) => {
  try {
    // Fetch the current auth session
    const { accessToken } = (await fetchAuthSession()).tokens ?? {};

    // Add the access token to the Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken.toString()}`;
    }

    return config;
  } catch (error) {
    // Handle any errors that occurred while fetching the auth session
    console.error('Failed to fetch auth session:', error);
    return config;
  }
});
