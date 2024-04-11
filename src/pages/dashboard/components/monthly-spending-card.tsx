import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthySpendingData } from '@/lib/types';
import { useMemo } from 'react';
import { BarDataSeries, BarSeries } from '@/components/charts/interfaces';
import dayjs from 'dayjs';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';

const monthOrder = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface MonthlySpendingCardProps {
  monthlySpending?: MonthySpendingData[];
  loading?: boolean;
}

export function MonthlySpendingCard({
  monthlySpending,
  loading,
  ...props
}: MonthlySpendingCardProps) {
  const series = useMemo<BarSeries<string>[]>(() => {
    const groupedData: Record<number, BarDataSeries<string>> = {};

    // Update the values for the corresponding months
    monthlySpending?.forEach((item) => {
      const { iso_date, total } = item;
      const djs = dayjs(iso_date);
      const year = djs.toDate().getFullYear();
      const monthAbbr = djs.format('MMM YYYY');

      if (!groupedData[year]) {
        groupedData[year] = {
          type: 'bar',
          title: year.toString(),
          data: [],
        };
      }

      groupedData[year].data.push({ x: monthAbbr, y: parseFloat(total) });
    });

    return Object.values(groupedData);
  }, [monthlySpending]);
  return (
    <Card className="min-w-0 md:col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Monthly Totals ($)</CardTitle>
      </CardHeader>
      <CardContent>
        <NivoBarChart
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
        />
      </CardContent>
    </Card>
  );
}
