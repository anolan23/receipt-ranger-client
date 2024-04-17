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
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/hooks/use-theme';
import { SettingsLayout } from '@/layout/settings-layout';
import { Theme } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type AppearanceSettingsValues = {
  theme: Theme;
};

interface AppearanceSettingsProps {}

export function AppearanceSettings({ ...props }: AppearanceSettingsProps) {
  const { setTheme, theme } = useTheme();

  const form = useForm<AppearanceSettingsValues>({
    defaultValues: {
      theme: theme,
    },
  });

  async function onSubmit(values: AppearanceSettingsValues) {
    try {
      setTheme(values.theme);
      toast('Preferences updated');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the appearance of the app. Automatically switch between
              day and night themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="theme"
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="light" />
                          </FormControl>
                          <FormLabel className="font-normal">Light</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="dark" />
                          </FormControl>
                          <FormLabel className="font-normal">Dark</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="system" />
                          </FormControl>
                          <FormLabel className="font-normal">System</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>
        <Button>Update preferences</Button>
      </form>
    </Form>
  );
}
