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
import { Credentials } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CredentialsFormProps {
  onSubmit: SubmitHandler<Credentials>;
}

export function CredentialsForm({ onSubmit, ...props }: CredentialsFormProps) {
  const form = useForm<Credentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const internalOnSubmit: SubmitHandler<Credentials> = async function (values) {
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof Error) {
        form.setError('root', {
          message: error.message,
        });
      }
    }
  };

  return (
    <Form {...form}>
      {errors.root?.message && <FormMessage>{errors.root.message}</FormMessage>}
      <form onSubmit={form.handleSubmit(internalOnSubmit)}>
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
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    'Password must contain at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter',
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
          <Button variant="black">
            {isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up with Email
          </Button>
        </div>
      </form>
    </Form>
  );
}
