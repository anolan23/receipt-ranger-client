import { PieSeries } from '@/components/charts/interfaces';
import { NivoPieChart } from '@/components/charts/nivo-pie-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toDollar } from '@/lib/helpers';
import { CategoryTotalsResult } from '@/lib/types';
import { useMemo } from 'react';

interface CategoriesCardProps {
  data: CategoryTotalsResult[];
  loading: boolean;
}

export function CategoriesCard({ data, loading }: CategoriesCardProps) {
  const series = useMemo<PieSeries<number>[]>(() => {
    return data.map((dataPoint) => ({
      type: 'pie',
      title: dataPoint.category,
      data: {
        id: dataPoint.category,
        label: dataPoint.category,
        value: +dataPoint.total,
      },
    }));
  }, [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where it went</CardTitle>
      </CardHeader>
      <CardContent>
        <NivoPieChart
          series={series}
          loading={loading}
          categoryColors
          centerLabel="Spent"
          formatValue={(value) => toDollar(value, 'dollar')}
        />
      </CardContent>
    </Card>
  );
}
