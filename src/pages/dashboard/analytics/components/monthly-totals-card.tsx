import { BarSeries, Datum } from '@/components/charts/interfaces';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getDates } from '@/lib/helpers';
import { DatePreset, MonthySpendingData } from '@/lib/types';
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';

interface MonthlyTotalsCardProps {
  data?: MonthySpendingData[];
  dateRange?: DateRange;
  datePreset?: DatePreset;
  loading?: boolean;
}

export function MonthlyTotalsCard({
  data,
  loading,
  dateRange,
  datePreset,
  ...props
}: MonthlyTotalsCardProps) {
  const dates = useMemo(() => {
    return dateRange?.from && dateRange?.to
      ? getDates(dateRange?.from, dateRange?.to)
      : undefined;
  }, [dateRange?.from, dateRange?.to]);

  const series = useMemo<BarSeries<string>[]>(() => {
    if (!dates?.length) return [];
    if (!data?.length) return [];
    const totalSpentData: Record<string, number> = {};

    data.forEach((item) => {
      const str = new Date(item.month_date).toUTCString();
      const formattedDate = formatDate(new Date(item.month_date));
      totalSpentData[formattedDate] = parseFloat(item.total);
    });

    return [
      {
        type: 'bar',
        title: 'Monthly Totals',
        data:
          dates.map<Datum<string>>((date) => {
            const formattedDate = formatDate(date);
            return {
              x: formattedDate,
              y: totalSpentData[formattedDate] || 0,
            };
          }) || [],
      },
    ];
  }, [data, dates]);

  // const timeScaleTicks: string[] = useMemo(() => {
  //   if (!dateRange?.from || !dateRange?.to) return [];
  //   const scale = scaleTime().domain([dateRange.from, dateRange.to]);

  //   const ticks = scale.ticks(12);
  //   console.log('ticks', ticks);
  //   return ticks.map((tick) => formatDate(tick));
  // }, [dateRange?.from, dateRange?.to]);

  return (
    <Card className="min-w-0 md:col-span-1">
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
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            truncateTickAt: 30,
            format: (val) => {
              if (datePreset === '3-years') return '';
              else return undefined;
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
