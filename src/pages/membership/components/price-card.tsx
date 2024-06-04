import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ReloadIcon } from '@radix-ui/react-icons';

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
            <Badge>{badge}</Badge>
          </div>
        )}
        <div className="text-lg font-semibold">{title}</div>
      </CardHeader>
      <CardContent className="flex flex-col ">
        <p className="text-sm text-muted-foreground mb-8">{description}</p>
        <div className="flex flex-col items-center mb-4">
          <span className="font-bold text-2xl">
            <span>
              ${dollar}
              <span>.{cents}</span> <span>/ month</span>
              {footer && <sup>*</sup>}
            </span>
          </span>
          {/* <span className="text-3xl font-bold tracking-tighter mr-1">
          {price}
        </span>
        <span className="text-xs text-muted-foreground">
          per
          <br />
          {intervalText}
        </span> */}
        </div>
        <Button onClick={onClick} size="lg">
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </CardContent>
      {footer ? (
        <CardFooter className="text-center justify-center">
          <span className="text-xs text-muted-foreground">{footer}</span>
        </CardFooter>
      ) : null}
    </Card>
  );
}
