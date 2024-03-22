import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { AuthLayout } from '@/layout/auth-layout';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import {
  autoSignInUser,
  confirmUserSignUp,
  resendSignUpCodeToEmail,
} from '@/lib/api/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';

interface ConfirmPageProps {}

type ConfirmationValues = {
  code: string;
};
export function ConfirmPage({ ...props }: ConfirmPageProps) {
  const location = useLocation();
  const username: string | undefined = location.state?.username;
  const navigate = useNavigate();
  const form = useForm<ConfirmationValues>({
    defaultValues: {
      code: '',
    },
  });
  const [resending, setResending] = useState(false);

  async function onSubmit(values: ConfirmationValues) {
    try {
      if (!username) return;
      const { isSignUpComplete, nextStep } = await confirmUserSignUp({
        username,
        confirmationCode: values.code,
      });
      if (isSignUpComplete) {
        await autoSignInUser();
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

  const handleResendClick = async function () {
    try {
      if (!username) return;
      setResending(true);
      await resendSignUpCodeToEmail({ username });
    } catch (error) {
      console.error(error);
    } finally {
      setResending(false);
    }
  };
  const { isSubmitting, errors, isValid } = form.formState;
  const buttonDisabled = isSubmitting || !isValid;

  const renderContent = function () {
    if (!username)
      return (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            User cannot be confirmed, do not refresh the confirmation page.
          </AlertDescription>
        </Alert>
      );
    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Confirm your account
          </h1>
        </div>
        <div className="grid gap-6">
          <Form {...form}>
            {errors.root?.message && (
              <FormMessage>{errors.root.message}</FormMessage>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <p className="text-sm text-muted-foreground">
                  We have sent a code by email to {username}. Enter it below to
                  confirm your account.
                </p>
                <FormField
                  control={form.control}
                  name="code"
                  rules={{ required: true, minLength: 6, maxLength: 6 }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Verification code</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            value={field.value}
                            onChange={field.onChange}
                            autoFocus
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Button disabled={buttonDisabled}>
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm account
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-sm">
            <span>Didn't receive a code?</span>
            <Button
              variant="link"
              onClick={handleResendClick}
              disabled={resending}
            >
              Send a new code
            </Button>
          </p>
        </div>
      </>
    );
  };
  return <AuthLayout content={renderContent()} />;
}
