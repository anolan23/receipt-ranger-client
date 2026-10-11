import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/layout/auth-layout';
import { register } from '@/lib/api/auth';
import { Credentials } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { CredentialsForm } from './components/credentials-form';
import { usePageTitle } from '@/hooks/use-page-title';

interface SignupPageProps {}
export function SignupPage({ ...props }: SignupPageProps) {
  usePageTitle('Sign Up');
  const navigate = useNavigate();

  async function handleCredentialsSubmit(values: Credentials) {
    await register(values);
    navigate('/dashboard');
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
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <CredentialsForm onSubmit={handleCredentialsSubmit} />
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
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
