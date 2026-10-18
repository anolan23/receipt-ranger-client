import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './lib/dayjs-config.ts';
import { queryClient } from './queries/query-client.ts';

import { ThemeProvider } from './components/context/theme-context.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTop } from '@/components/scroll-to-top.tsx';

if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <App />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
