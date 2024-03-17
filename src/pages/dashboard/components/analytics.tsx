import { BarChart } from '@/components/charts/bar-chart';
import { BarSeries, Datum } from '@/components/charts/interfaces';
import { DateRangePicker } from '@/components/date-range-picker';
import { Select } from '@/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSpendingExplorer } from '@/hooks/use-spending-explorer';
import {
  SpendingExplorerResult,
  SpendingExplorerCategoryResult,
} from '@/lib/types';
import { getRandomColor } from '@/lib/utils';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

type Granularity = 'daily' | 'monthly';
type Dimension = 'category' | 'none';
interface AnalyticsProps {}

const isGranularity = function (str: string): str is Granularity {
  return str === 'daily' || str === 'monthly';
};

const isDimension = function (str: string): str is Dimension {
  return str === 'category' || str === 'none';
};

export function Analytics({ ...props }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [granularity, setGranularity] = useState<Granularity>('monthly');
  const [dimension, setDimension] = useState<Dimension>('category');
  const { data } = useSpendingExplorer({
    start_date: dateRange?.from?.toISOString() || '',
    end_date: dateRange?.to?.toISOString() || '',
    granularity,
    dimension: dimension === 'category' ? dimension : undefined,
  });

  const isSpendingExplorerCategoryResult = function (
    item: SpendingExplorerResult
  ): item is SpendingExplorerCategoryResult {
    return 'category' in item;
  };

  const computeSeries = useCallback(
    (
      data: SpendingExplorerResult[],
      dimension: Dimension,
      granularity: Granularity
    ) => {
      const series: BarSeries<string>[] = [];
      if (dimension === 'category') {
        const categoryData: { [key: string]: Datum<string>[] } = {};

        data.forEach((item) => {
          if (!isSpendingExplorerCategoryResult(item)) return;
          const category = item.category || 'Unknown';
          const datum: Datum<string> = {
            x:
              granularity === 'monthly'
                ? dayjs(item.date).format('MMM YYYY')
                : granularity === 'daily'
                ? dayjs(item.date).format('MMM DD, YYYY')
                : '',
            y: parseFloat(item.total_spent),
          };

          if (categoryData[category]) {
            categoryData[category].push(datum);
          } else {
            categoryData[category] = [datum];
          }
        });

        Object.entries(categoryData).forEach(([category, data]) => {
          series.push({
            type: 'bar',
            title: category,
            data,
            color: getRandomColor(),
          });
        });
      } else {
        const _data: Datum<string>[] = data.map((item) => ({
          x:
            granularity === 'monthly'
              ? dayjs(item.date).format('MMM YYYY')
              : granularity === 'daily'
              ? dayjs(item.date).format('MMM DD, YYYY')
              : '',
          y: parseFloat(item.total_spent),
        }));

        series.push({
          type: 'bar',
          title: 'Total Spent',
          data: _data,
          color: getRandomColor(),
        });
      }

      return series;
    },
    []
  );

  const series = useMemo(() => {
    if (!data) return undefined;
    return computeSeries(data, dimension, granularity);
  }, [data, computeSeries, dimension, granularity]);

  return (
    <>
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle>Spending explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              series={series || []}
              hideFilter
              stackedBars
              height={450}
            />
          </CardContent>
        </Card>
        <div className="hidden flex-col space-y-4 sm:flex md:order-2">
          <div className="grid gap-2">
            <Label>Date range</Label>
            <DateRangePicker
              dateRange={dateRange}
              onRangeSelect={setDateRange}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Displaying year to date
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Granularity</Label>
            <Select
              placeholder="Choose granularity"
              items={[
                { label: 'Daily', value: 'daily' },
                { label: 'Monthly', value: 'monthly' },
              ]}
              value={granularity}
              onValueChange={(value) => {
                if (!isGranularity(value)) return;
                setGranularity(value);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Dimension</Label>
            <Select
              placeholder="Choose Dimension"
              items={[
                { label: 'None', value: 'none' },
                { label: 'Category', value: 'category' },
              ]}
              value={dimension}
              onValueChange={(value) => {
                if (!isDimension(value)) return;
                setDimension(value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
