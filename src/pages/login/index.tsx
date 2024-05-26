import { useForm } from 'react-hook-form';

import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/layout/auth-layout';
import { googleSignIn, loginUser } from '@/lib/api/auth';
import { Credentials } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '@/components/google-icon';

interface LoginPageProps {}

export function LoginPage({ ...props }: LoginPageProps) {
  const navigate = useNavigate();
  const form = useForm<Credentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: Credentials) {
    try {
      const { isSignedIn, nextStep } = await loginUser({
        username: values.email,
        password: values.password,
      });
      if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        navigate('/confirm', { state: { username: values.email } });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        form.setError('root', {
          message: error.message,
        });
      }
    }
  }
  const { isSubmitting, errors } = form.formState;

  return (
    <AuthLayout
      action={
        <Button variant="ghost" asChild>
          <Link to={'/signup'}>Sign up</Link>
        </Button>
      }
      content={
        <>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below
            </p>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              {errors.root?.message && (
                <FormMessage>{errors.root.message}</FormMessage>
              )}
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="name@example.com"
                              autoCapitalize="none"
                              autoComplete="email"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>{errors.email?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              autoCapitalize="none"
                              autoComplete="password"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>{errors.password?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button>
                    {isSubmitting && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Log in with Email
                  </Button>
                </div>
              </form>
            </Form>

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
