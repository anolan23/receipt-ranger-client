import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';

interface AuthLayoutProps {
  content: ReactNode;
  action?: ReactNode;
}

export function AuthLayout({ content, action, ...props }: AuthLayoutProps) {
  const { isAuthenticated } = useUser();
  if (isAuthenticated === true) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo fill="white" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Managing receipts has never been easier. This app has
              revolutionized the way I keep track of my expenses, saving me time
              and hassle."
            </p>
            <footer className="text-sm">Alex Thompson</footer>
          </blockquote>
        </div>
      </div>
      {action && (
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          {action}
        </div>
      )}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {content}
        </div>
      </div>
    </div>
  );
}
