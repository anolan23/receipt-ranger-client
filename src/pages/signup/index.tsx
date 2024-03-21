import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/layout/auth-layout';

interface SignupPageProps {}

export function SignupPage({ ...props }: SignupPageProps) {
  return (
    <AuthLayout
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
            <form>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    type="email"
                  />
                </div>
                <Button>Sign up with Email</Button>
              </div>
            </form>
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
            <Button variant="outline" type="button">
              {' '}
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
