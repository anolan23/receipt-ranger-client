import { StatusIndicator } from '@/components/status-indicator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserAttributes } from '@/hooks/use-user-attributes';

interface ProfileSettingsProps {}

export function ProfileSettings({ ...props }: ProfileSettingsProps) {
  const { data, isLoading } = useUserAttributes();

  if (isLoading)
    return <StatusIndicator status="loading">Loading</StatusIndicator>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          autoComplete="email"
          disabled
          value={data?.email ?? ''}
        />
      </CardContent>
    </Card>
  );
}
