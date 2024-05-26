import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/layout/auth-layout';
import { googleSignIn, signUpUser } from '@/lib/api/auth';
import { Credentials } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { CredentialsForm } from './components/credentials-form';
import { GoogleIcon } from '@/components/google-icon';
import { usePageTitle } from '@/hooks/use-page-title';

interface SignupPageProps {}
export function SignupPage({ ...props }: SignupPageProps) {
  usePageTitle('Sign Up');
  const navigate = useNavigate();

  async function handleCredentialsSubmit(values: Credentials) {
    const { nextStep } = await signUpUser(values);
    if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      navigate('/confirm', { state: { username: values.email } });
    }
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" type="button" onClick={googleSignIn}>
              <GoogleIcon />
              Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              to="/privacy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </>
      }
    />
  );
}
