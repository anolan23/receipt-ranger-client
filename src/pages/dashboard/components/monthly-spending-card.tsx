import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthySpendingData } from '@/lib/types';
import { useMemo } from 'react';
import { BarDataSeries, BarSeries } from '@/components/charts/interfaces';
import { BarChart } from '@/components/charts/bar-chart';
import dayjs from 'dayjs';

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
}

export function MonthlySpendingCard({
  monthlySpending,
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart series={series} hideLegend hideFilter />
      </CardContent>
    </Card>
  );
}
