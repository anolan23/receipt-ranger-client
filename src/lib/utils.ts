import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { queryClient } from '@/queries/query-client';

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function clearQueryCache() {
  queryClient.clear();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
