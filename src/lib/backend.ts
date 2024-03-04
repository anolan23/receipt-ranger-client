import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const backend = axios.create({
  baseURL: API_BASE_URL,
});
