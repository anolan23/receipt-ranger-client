import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface SettingsLayoutProps {
  title: string;
  description: string;
  form?: ReactNode;
}

export function SettingsLayout({
  title = 'Settings',
  description = 'Make it yours.',
  form,
}: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="type-h2">{title}</h2>
        <p className="text-sm text-ink-muted">{description}</p>
      </div>
      <Separator />
      {form}
    </div>
  );
}
