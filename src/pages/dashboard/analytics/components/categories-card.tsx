import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './index.module.scss';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';
import { CategoryTotalsResult } from '@/lib/types';
import { useMemo } from 'react';
import { BarSeries } from '@/components/charts/interfaces';

interface CategoriesCardProps {
  data: CategoryTotalsResult[];
  loading: boolean;
}

export function CategoriesCard({
  data,
  loading,
  ...props
}: CategoriesCardProps) {
  const series = useMemo<BarSeries<string>[]>(() => {
    return data.map((dataPoint) => {
      return {
        type: 'bar',
        title: dataPoint.category,
        data: [{ x: dataPoint.category, y: +dataPoint.total }],
      };
    });
  }, [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Receipt Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <NivoBarChart
          onClick={(datum) => {
            console.log(datum.id);
          }}
          className="h-[200px] sm:h-[300px]"
          series={series}
          hideFilter
          loading={loading}
          margin={{ top: 10, right: 0, bottom: 50, left: 50 }}
          gridYValues={5}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            truncateTickAt: 0,
            tickValues: 5,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            truncateTickAt: 0,
            tickValues: 5,
          }}
          //   axisBottom={null}
          // layout="horizontal"
          // label={(val) => val.id.toString()}
        />
      </CardContent>
    </Card>
  );
}
