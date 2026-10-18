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
import { getErrorMessage } from '@/lib/api/auth';
import { Credentials } from '@/lib/types';
import { LoaderCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CredentialsFormProps {
  onSubmit: SubmitHandler<Credentials>;
  pending?: boolean;
  error?: unknown;
}

export function CredentialsForm({ onSubmit, pending, error, ...props }: CredentialsFormProps) {
  const form = useForm<Credentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { errors } = form.formState;

  return (
    <Form {...form}>
      {error != null && <FormMessage>{getErrorMessage(error)}</FormMessage>}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Entered value does not match email format',
                },
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
                minLength: {
                  value: 8,
                  message: 'Password must have at least 8 characters',
                },
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
          <Button size="lg" className="mt-2" disabled={pending}>
            {pending && (
              <LoaderCircle aria-hidden className="animate-spin" />
            )}
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}
