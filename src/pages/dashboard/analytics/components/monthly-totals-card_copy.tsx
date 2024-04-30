import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './index.module.scss';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';
import {
  SpendingExplorerCategoryResult,
  SpendingExplorerResult,
} from '@/lib/types';
import { useCallback, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { BarSeries, Datum } from '@/components/charts/interfaces';
import { scaleTime } from 'd3-scale';
import dayjs from 'dayjs';

const generateDates = (
  startDate: Date,
  endDate: Date,
  granularity: Granularity
): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate =
      granularity === 'monthly'
        ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        : new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          );
  }

  return dates;
};

type Granularity = 'daily' | 'monthly';
type Dimension = 'category' | 'none';
type CategoryData = Record<string, Record<string, number>>;

interface MonthlyTotalsCardProps {
  loading?: boolean;
  dateRange?: DateRange;
  data?: SpendingExplorerResult[];
}

export function MonthlyTotalsCard({
  loading,
  dateRange,
  data,
}: MonthlyTotalsCardProps) {
  const isSpendingExplorerCategoryResult = function (
    item: SpendingExplorerResult
  ): item is SpendingExplorerCategoryResult {
    return 'category' in item;
  };

  const dates = useMemo(() => {
    return dateRange?.from && dateRange?.to
      ? generateDates(dateRange?.from, dateRange?.to, 'monthly')
      : undefined;
  }, [dateRange?.from, dateRange?.to]);

  const formatDate = (date: Date, granularity: Granularity): string => {
    return granularity === 'monthly'
      ? dayjs(date).format('MMM YYYY')
      : granularity === 'daily'
      ? dayjs(date).format('MMM-DD')
      : '';
  };

  const formatToSeries = useCallback(
    (
      data: SpendingExplorerResult[],
      dimension: Dimension,
      granularity: Granularity
    ): BarSeries<string>[] => {
      if (!dates?.length) return [];
      if (dimension === 'category') {
        const categoryData: CategoryData = {};

        data.forEach((item) => {
          if (!isSpendingExplorerCategoryResult(item)) return;
          const category = item.category || 'Unknown';
          const formattedDate = formatDate(new Date(item.date), granularity);

          categoryData[category] = {
            ...categoryData[category],
            [formattedDate]: parseFloat(item.total_spent),
          };
        });

        return Object.entries(categoryData).map<BarSeries<string>>(
          ([category, data]) => ({
            type: 'bar',
            title: category,
            data: dates.map<Datum<string>>((date) => {
              const formattedDate = formatDate(date, granularity);
              return {
                x: formattedDate,
                y: data[formatDate(date, granularity)] || 0,
              };
            }),
          })
        );
      } else {
        const totalSpentData: Record<string, number> = {};

        data.forEach((item) => {
          const formattedDate = formatDate(new Date(item.date), granularity);
          totalSpentData[formattedDate] = parseFloat(item.total_spent);
        });

        return [
          {
            type: 'bar',
            title: 'Total Spent',
            data: dates?.map((date) => ({
              x: formatDate(date, granularity),
              y: totalSpentData[formatDate(date, granularity)] || 0,
            })),
          },
        ];
      }
    },
    [dates]
  );

  const series = useMemo(() => {
    if (!data) return [];
    return formatToSeries(data, 'none', 'monthly');
  }, [data, formatToSeries]);

  const timeScaleTicks: string[] = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    const scale = scaleTime().domain([dateRange.from, dateRange.to]);

    const ticks = scale.ticks(10);
    return ticks.map((tick) => formatDate(tick, 'monthly'));
  }, [dateRange?.from, dateRange?.to]);

  return (
    <Card className=" min-w-0">
      <CardHeader>
        <CardTitle>Monthly Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <NivoBarChart
          className="h-[250px] sm:h-[300px]"
          loading={loading}
          series={series}
          hideFilter
          label={(d) => `$${d.value}`}
          margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
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
            truncateTickAt: 30,
            format: (val) => {
              return timeScaleTicks.includes(
                formatDate(new Date(val), 'monthly')
              )
                ? formatDate(new Date(val), 'monthly')
                : '';
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
