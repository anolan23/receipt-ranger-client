import { MerchantBars } from '@/components/charts/merchant-bars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MerchantCountsResult } from '@/lib/types';
import { useMemo } from 'react';

interface MerchantsCardProps {
  data: MerchantCountsResult[];
}

export function MerchantsCard({ data }: MerchantsCardProps) {
  const rows = useMemo(
    () => data.map((dataPoint) => ({ name: dataPoint.merchant, count: dataPoint.count })),
    [data]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your top stores</CardTitle>
      </CardHeader>
      <CardContent>
        <MerchantBars data={rows} />
      </CardContent>
    </Card>
  );
}
