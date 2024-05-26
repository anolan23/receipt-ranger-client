import { DollarInput } from '@/components/dollar-input';
import { StatusIndicator } from '@/components/status-indicator';
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
import { useToast } from '@/components/ui/use-toast';
import { useGoal } from '@/hooks/use-goal';
import { createOrUpdateGoal } from '@/lib/api/goals';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

type GoalsSettingsValues = {
  amount: string;
};

interface GoalsSettingsProps {}

export function GoalsSettings({ ...props }: GoalsSettingsProps) {
  const { data: goal, isLoading } = useGoal();
  const { toast } = useToast();

  const defaultValues = useMemo<GoalsSettingsValues>(() => {
    return {
      amount: goal?.amount || '',
    };
  }, [goal]);
  const form = useForm<GoalsSettingsValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  async function onSubmit(values: GoalsSettingsValues) {
    try {
      const result = await createOrUpdateGoal(values.amount);
      toast({ variant: 'default', title: 'Goals updated' });
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
  if (isLoading)
    return <StatusIndicator status="loading">Loading</StatusIndicator>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              Track your spending and stay on top of your budget goals with
              ease.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              rules={{ required: false }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Monthly Budget Goal</FormLabel>
                    <FormControl>
                      <DollarInput
                        type="number"
                        placeholder="$0.00"
                        step="0.01"
                        min="0"
                        autoCapitalize="none"
                        autoComplete="name"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your total monthly budget to track your overall
                      spending and financial goals.
                    </FormDescription>
                    <FormMessage>{errors.amount?.message}</FormMessage>
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
          Update goals
        </Button>
      </form>
    </Form>
  );
}
