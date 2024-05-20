import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';

import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './lib/amplify-config.ts';

import { ThemeProvider } from './components/context/theme-context.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { Toaster } from '@/components/ui/toaster';

if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
