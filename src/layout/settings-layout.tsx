import { ReactNode } from 'react';

interface SettingsLayoutProps {
  title: string;
  description: string;
  form?: ReactNode;
}

export function SettingsLayout({
  title = 'Settings Title',
  description = 'This is a description',
  form,
  ...props
}: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        data-orientation="horizontal"
        className="shrink-0 bg-border h-[1px] w-full"
      ></div>
      {form}
    </div>
  );
}
