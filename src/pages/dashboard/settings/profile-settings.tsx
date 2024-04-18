import { Loader } from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserAttributes } from '@/hooks/use-user-attributes';
import { SettingsLayout } from '@/layout/settings-layout';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { updateUserAttributes } from 'aws-amplify/auth';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ProfileSettingsValues = {
  name: string;
  email: string;
  phone: string;
};

interface ProfileSettingsProps {}

export function ProfileSettings({ ...props }: ProfileSettingsProps) {
  const { data, isLoading } = useUserAttributes();

  const defaultValues = useMemo<ProfileSettingsValues>(() => {
    return {
      name: data?.name || '',
      email: data?.email || '',
      phone: data?.phone_number || '',
    };
  }, [data]);
  const form = useForm<ProfileSettingsValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  async function onSubmit(values: ProfileSettingsValues) {
    try {
      const attributes = await updateUserAttributes({
        userAttributes: {
          name: values.name,
          phone_number: values.phone,
        },
      });
      toast('Profile updated');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        form.setError('root', {
          message: error.message,
        });
      }
    }
  }

  const { errors, isSubmitting, isValid } = form.formState;
  if (isLoading) return <Loader />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your profile settings. Verify a phone number to speed up
              the upload process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="name@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="name"
              rules={{ required: false }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your name"
                        autoCapitalize="none"
                        autoComplete="name"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile
                      and in emails.
                    </FormDescription>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: false,
                pattern: {
                  value: /^\+\d+$/,
                  message:
                    'Phone number must start with a plus sign (+) followed by the country code and the phone number. Example: +14325551212',
                },
              }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., (123) 456-7890"
                        autoCapitalize="none"
                        autoComplete="tel"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Providing your phone number allows for easy receipt
                      uploading via text message.
                    </FormDescription>
                    <FormMessage>{errors.phone?.message}</FormMessage>
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>
        {errors.root?.message && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
        <Button disabled={isSubmitting}>
          {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
