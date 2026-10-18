import { usePageTitle } from '@/hooks/use-page-title';
import { ErrorLayout } from './error-layout';

export function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <div className="min-h-dvh bg-surface-100 text-ink">
      <ErrorLayout
        hideLogo={false}
        title="Oops, I can't find that page"
        description="It may have wandered off. Let's get you back on track!"
      />
    </div>
  );
}
