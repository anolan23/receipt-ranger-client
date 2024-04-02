import { type ClassValue, clsx } from 'clsx';
import { mutate } from 'swr';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function clearSWRCache() {
  mutate(() => true, undefined, { revalidate: false });
}
