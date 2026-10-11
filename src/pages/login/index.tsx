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
import { getErrorMessage, login } from '@/lib/api/auth';
import { Credentials } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/use-page-title';

interface LoginPageProps {}

export function LoginPage({ ...props }: LoginPageProps) {
  usePageTitle('Login');
  const navigate = useNavigate();
  const form = useForm<Credentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: Credentials) {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      form.setError('root', { message: getErrorMessage(error) });
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
                  <Button variant="black">
                    {isSubmitting && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Log in with Email
                  </Button>
                </div>
              </form>
            </Form>

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
