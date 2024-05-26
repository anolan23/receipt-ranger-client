import { ErrorLayout } from './error-layout';

interface NotFoundPageProps {}

export function NotFoundPage({ ...props }: NotFoundPageProps) {
  return (
    <ErrorLayout
      hideLogo={false}
      title="404 - Page Not Found"
      description="Oops! Looks like the page you're searching for has gone missing. Don't worry, though – we'll help you get back on track!"
    />
  );
}
