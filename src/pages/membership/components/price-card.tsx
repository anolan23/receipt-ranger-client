import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CircleX, LoaderCircle } from 'lucide-react';

interface PriceCardProps {
  title: string;
  description: string;
  /** Price per month shown in the headline, e.g. "3.33". */
  price: string;
  interval: 'monthly' | 'yearly';
  /** What is actually charged each billing period, e.g. "39.99". */
  billedAmount: string;
  badge?: string;
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function renewalDate(interval: 'monthly' | 'yearly') {
  const date = new Date();
  if (interval === 'monthly') date.setMonth(date.getMonth() + 1);
  else date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PriceCard({
  title,
  description,
  price,
  interval,
  billedAmount,
  badge,
  buttonText,
  loading,
  disabled,
  error,
  onClick,
}: PriceCardProps) {
  const [dollar, cents] = price.split('.');
  const billing =
    interval === 'monthly'
      ? `Billed $${billedAmount} every month.`
      : `Billed $${billedAmount} once a year.`;
  const label =
    buttonText ??
    `Get Pro, $${billedAmount}/${interval === 'monthly' ? 'month' : 'year'}`;
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        {badge && (
          <div>
            <Badge variant="win">{badge}</Badge>
          </div>
        )}
        <div className="type-h2">{title}</div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <p className="mb-8 text-sm text-ink-muted">{description}</p>
        <div className="mb-4 flex flex-col items-center gap-1">
          <span className="num font-display text-3xl font-semibold">
            ${dollar}.{cents}
            <span className="text-sm font-normal text-ink-muted">
              {' '}
              / month
            </span>
          </span>
          <span className="text-sm">{billing}</span>
          <span className="text-center text-xs text-ink-muted">
            Renews {renewalDate(interval)}. Cancel any time in Settings.
          </span>
        </div>
        <Button
          onClick={onClick}
          size="lg"
          disabled={loading || disabled}
          aria-busy={loading}
        >
          {loading && <LoaderCircle aria-hidden className="animate-spin" />}
          {loading ? 'Opening checkout…' : label}
        </Button>
        {error && (
          <Alert variant="oops" className="mt-4">
            <CircleX aria-hidden />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
