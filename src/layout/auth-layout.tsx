import { Blob } from '@/components/blob';
import { Logo } from '@/components/logo';
import { Pip } from '@/components/mascot';
import { useUser } from '@/hooks/use-user';
import { ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';

interface AuthLayoutProps {
  content: ReactNode;
  action?: ReactNode;
}

export function AuthLayout({ content, action }: AuthLayoutProps) {
  const { isAuthenticated } = useUser();
  if (isAuthenticated === true) return <Navigate to="/dashboard" />;

  return (
    <div className="relative grid min-h-dvh grid-cols-1 bg-surface-100 text-ink lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-surface-200 p-10 lg:flex">
        <Blob color="peach" className="-top-20 -left-24 h-96 w-96" />
        <Blob color="butter" className="right-[-6rem] bottom-24 h-80 w-80" />
        <Blob color="sage" className="bottom-[-5rem] left-24 h-64 w-64" />
        <div className="relative z-10">
          <Link to="/" aria-label="Receipt Ranger home">
            <Logo />
          </Link>
        </div>
        <div className="relative z-10 my-auto grid justify-items-start gap-6">
          <Pip mood="happy" size={200} />
          <div className="space-y-3">
            <h2 className="type-display-xl max-w-[14ch]">
              Receipts in, insights out!
            </h2>
            <p className="type-body-lg max-w-[36ch] text-ink">
              Snap a receipt and I&apos;ll sort out the stores, categories and
              line items, so you can see where the month went.
            </p>
          </div>
        </div>
      </div>
      {action && (
        <div className="absolute top-4 right-4 z-10 md:top-8 md:right-8">
          {action}
        </div>
      )}
      <div className="flex items-center px-4 py-24 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[380px]">
          <div className="flex justify-center lg:hidden">
            <Link to="/" aria-label="Receipt Ranger home">
              <Logo />
            </Link>
          </div>
          {content}
        </div>
      </div>
    </div>
  );
}
