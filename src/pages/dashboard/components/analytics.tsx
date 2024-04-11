import { BarSeries, Datum } from '@/components/charts/interfaces';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';
import { DateRangePicker } from '@/components/date-range-picker';
import { Select } from '@/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSpendingExplorer } from '@/hooks/use-spending-explorer';
import {
  SpendingExplorerCategoryResult,
  SpendingExplorerResult,
} from '@/lib/types';
import { BarChartIcon } from '@radix-ui/react-icons';
import { scaleTime } from 'd3-scale';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

type Granularity = 'daily' | 'monthly';
type Dimension = 'category' | 'none';
type GroupMode = 'stacked' | 'grouped';
type CategoryData = Record<string, Record<string, number>>;

interface AnalyticsProps {}

const isGranularity = function (str: string): str is Granularity {
  return str === 'daily' || str === 'monthly';
};

const isDimension = function (str: string): str is Dimension {
  return str === 'category' || str === 'none';
};

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

const formatDate = (date: Date, granularity: Granularity): string => {
  return granularity === 'monthly'
    ? dayjs(date).format('MMM YYYY')
    : granularity === 'daily'
    ? dayjs(date).format('MMM-DD')
    : '';
};

export function Analytics({ ...props }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [granularity, setGranularity] = useState<Granularity>('monthly');
  const [dimension, setDimension] = useState<Dimension>('category');
  const [groupMode, setGroupMode] = useState<GroupMode>('stacked');
  const { data, isLoading } = useSpendingExplorer({
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

  const dates = useMemo(() => {
    return dateRange?.from && dateRange?.to
      ? generateDates(dateRange?.from, dateRange?.to, granularity)
      : undefined;
  }, [dateRange?.from, dateRange?.to, granularity]);

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
    return formatToSeries(data, dimension, granularity);
  }, [data, formatToSeries, dimension, granularity]);

  const timeScaleTicks: string[] = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    const scale = scaleTime().domain([dateRange.from, dateRange.to]);

    const ticks = scale.ticks(10);
    return ticks.map((tick) => formatDate(tick, granularity));
  }, [dateRange?.from, dateRange?.to, granularity]);

  return (
    <>
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
        <Card className=" min-w-0">
          <CardHeader>
            <CardTitle>Spending explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <NivoBarChart
              className="h-[250px] sm:h-[400px]"
              loading={isLoading}
              series={series}
              hideFilter
              groupMode={groupMode}
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
                    formatDate(new Date(val), granularity)
                  )
                    ? formatDate(new Date(val), granularity)
                    : '';
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex-col space-y-4 sm:flex md:order-2">
              <div className="grid gap-2">
                <Label>Date range</Label>
                <DateRangePicker
                  className="w-full"
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
              <div className="grid gap-2">
                <Label>Group mode</Label>
                <ToggleGroup
                  type="single"
                  className="justify-start"
                  value={groupMode}
                  onValueChange={(value: GroupMode) => {
                    setGroupMode(value);
                  }}
                >
                  <ToggleGroupItem value="stacked" aria-label="Toggle stacked">
                    {/* <BarChartIcon className="h-4 w-4" /> */}Stacked
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grouped" aria-label="Toggle grouped">
                    {/* <BarChartIcon className="h-4 w-4" /> */}Grouped
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
