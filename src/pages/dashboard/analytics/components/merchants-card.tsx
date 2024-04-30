import { PieSeries } from '@/components/charts/interfaces';
import { NivoPieChart } from '@/components/charts/nivo-pie-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MerchantCountsResult } from '@/lib/types';
import { useMemo } from 'react';

interface MerchantsCardProps {
  data: MerchantCountsResult[];
}

export function MerchantsCard({ data, ...props }: MerchantsCardProps) {
  const series = useMemo<PieSeries<number>[]>(() => {
    return data.map((dataPoint) => {
      return {
        type: 'pie',
        title: dataPoint.merchant,
        data: {
          id: dataPoint.merchant,
          label: dataPoint.merchant,
          value: dataPoint.count,
        },
      };
    });
  }, [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <NivoPieChart series={series} />
      </CardContent>
    </Card>
  );
}
