import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface PriceCardProps {
  title: string;
  description: string;
  price: string;
  interval: 'monthly' | 'yearly';
  badge?: string;
  footer?: string;
  buttonText?: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function PriceCard({
  title,
  description,
  price,
  interval,
  badge,
  buttonText = 'Upgrade to Pro',
  loading,
  footer,
  onClick,
  ...props
}: PriceCardProps) {
  const intervalText = interval === 'monthly' ? 'month' : 'year';
  const [dollar, cents] = price.split('.');
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        {badge && (
          <div>
            <Badge variant="win">{badge}</Badge>
          </div>
        )}
        <div className="type-h2">{title}</div>
      </CardHeader>
      <CardContent className="flex flex-col ">
        <p className="mb-8 text-sm text-ink-muted">{description}</p>
        <div className="flex flex-col items-center mb-4">
          <span className="num font-display text-3xl font-semibold">
            <span>
              ${dollar}
              <span>.{cents}</span> <span>/ month</span>
              {footer && <sup>*</sup>}
            </span>
          </span>
          {/* <span className="text-3xl font-bold tracking-tighter mr-1">
          {price}
        </span>
        <span className="text-xs text-ink-muted">
          per
          <br />
          {intervalText}
        </span> */}
        </div>
        <Button onClick={onClick} size="lg">
          {loading && <LoaderCircle aria-hidden className="animate-spin" />}
          {buttonText}
        </Button>
      </CardContent>
      {footer ? (
        <CardFooter className="text-center justify-center">
          <span className="text-xs text-ink-muted">{footer}</span>
        </CardFooter>
      ) : null}
    </Card>
  );
}
