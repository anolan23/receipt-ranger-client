import { Logo } from '@/components/logo';
import { Pip } from '@/components/mascot';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ErrorLayoutProps {
  title: string;
  description?: string;
  hideLogo?: boolean;
}

/** Kind error state: Pip looks worried, and there's always a way forward. */
export function ErrorLayout({
  title,
  description,
  hideLogo = true,
}: ErrorLayoutProps) {
  const logoVisible = !hideLogo;
  return (
    <div className="min-h-[50dvh]">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 p-4 py-12 text-center">
        {logoVisible && (
          <div className="mb-2">
            <Logo />
          </div>
        )}
        <Pip mood="oops" size={140} />
        <h1 className="type-h1 lg:text-[44px] lg:leading-[48px]">{title}</h1>
        {description && (
          <p className="type-body-lg text-ink-muted">{description}</p>
        )}
        <Button size="lg" asChild className="mt-2 self-stretch sm:self-center">
          <Link to="/dashboard">Take me home</Link>
        </Button>
      </div>
    </div>
  );
}
