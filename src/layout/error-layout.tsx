import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ErrorLayoutProps {
  title: string;
  description?: string;
  hideLogo?: boolean;
}

export function ErrorLayout({
  title,
  description,
  hideLogo = true,
  ...props
}: ErrorLayoutProps) {
  const logoVisible = !hideLogo;
  return (
    <div>
      <div className="mx-auto max-w-xl flex flex-col items-center space-y-4 p-4 py-12 text-center">
        {logoVisible && (
          <div className="mb-4">
            <Logo />
          </div>
        )}
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}
        <Button size="lg" asChild className=" self-stretch">
          <Link to="/dashboard">Go back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
