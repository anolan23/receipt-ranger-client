import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '../../../components/bar-chart/bar-chart';
import { MonthySpendingData } from '@/lib/types';
import { useMemo } from 'react';
import { BarDataSeries, BarSeries } from '@/components/bar-chart/interfaces';

interface MonthlySpendingCardProps {
  monthlySpending?: MonthySpendingData[];
}

export function MonthlySpendingCard({
  monthlySpending,
  ...props
}: MonthlySpendingCardProps) {
  const series = useMemo<BarSeries<string>[]>(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const groupedData: Record<number, BarDataSeries<string>> = {};

    // Initialize groupedData with all the months for each year
    monthlySpending?.forEach((item) => {
      const { year } = item;
      if (!groupedData[year]) {
        groupedData[year] = {
          type: 'bar',
          title: year.toString(),
          data: months.map((month) => ({ x: month, y: 0 })),
        };
      }
    });

    // Update the values for the corresponding months
    monthlySpending?.forEach((item) => {
      const { month_name, total, year } = item;
      const monthIndex = months.indexOf(month_name);
      if (monthIndex !== -1) {
        groupedData[year].data[monthIndex].y = parseFloat(total);
      }
    });

    return Object.values(groupedData);
  }, [monthlySpending]);
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart series={series} hideLegend />
      </CardContent>
    </Card>
  );
}
