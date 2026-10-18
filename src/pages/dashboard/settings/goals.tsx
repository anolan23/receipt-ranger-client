import { DollarInput } from '@/components/dollar-input';
import { LoadingState } from '@/components/loading-state';
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
import { useGoal, useSaveGoal } from '@/queries/goals';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
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

  const saveGoal = useSaveGoal();

  function onSubmit(values: GoalsSettingsValues) {
    saveGoal.mutate(values.amount, {
      onSuccess: () => {
        toast({
          title: 'Goal saved!',
          description: 'Nice, your budget is all set.',
        });
      },
      onError: (error) => {
        console.error(error);
        form.setError('root', { message: error.message });
      },
    });
  }

  const { errors, isValid } = form.formState;
  if (isLoading) return <LoadingState label="Fetching your goal…" />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly goal</CardTitle>
            <CardDescription>
              Set a monthly budget and I'll cheer you on as you get closer.
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
                    <FormLabel>Monthly budget</FormLabel>
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
          <Alert variant="oops">
            <TriangleAlert aria-hidden />
            <AlertTitle>Oops, that didn't save</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
        <Button disabled={saveGoal.isPending}>
          {saveGoal.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
          Save goal
        </Button>
      </form>
    </Form>
  );
}
