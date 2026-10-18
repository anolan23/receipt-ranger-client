import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/layout/auth-layout';
import { useRegister } from '@/queries/user';
import { Credentials } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { CredentialsForm } from './components/credentials-form';
import { usePageTitle } from '@/hooks/use-page-title';

interface SignupPageProps {}
export function SignupPage({ ...props }: SignupPageProps) {
  usePageTitle('Sign Up');
  const navigate = useNavigate();

  const register = useRegister();

  function handleCredentialsSubmit(values: Credentials) {
    register.mutate(values, { onSuccess: () => navigate('/dashboard') });
  }

  return (
    <AuthLayout
      action={
        <Button variant="ghost" asChild>
          <Link to={'/'}>Log in</Link>
        </Button>
      }
      content={
        <>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="type-h1">
              Let's get you set up!
            </h1>
            <p className="text-sm text-ink-muted">
              Make an account and scan your first receipt in a minute.
            </p>
          </div>
          <div className="grid gap-6">
            <CredentialsForm
              onSubmit={handleCredentialsSubmit}
              pending={register.isPending}
              error={register.error}
            />
          </div>
          <p className="px-4 text-center text-sm text-ink-muted">
            By signing up, you agree to our{' '}
            <Link external href="https://snapceipt.com/terms-of-service/">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link external href="https://snapceipt.com/privacy-policy/">
              Privacy Policy
            </Link>
          </p>
        </>
      }
    />
  );
}
