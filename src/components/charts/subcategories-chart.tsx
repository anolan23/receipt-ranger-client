import { useMemo } from 'react';
import styles from './index.module.scss';
import { NivoBarChart } from './nivo-bar-chart';
import { BarSeries } from './interfaces';
import { SubcategoryTotalsResult } from '@/lib/types';

interface SubcategoriesChartProps {
  data: SubcategoryTotalsResult[];
  loading: boolean;
  onCategoryClick?: (subcategory: string) => void;
}

export function SubcategoriesChart({
  data,
  loading,
  onCategoryClick,
  ...props
}: SubcategoriesChartProps) {
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
    <NivoBarChart
      onClick={(datum) => {
        if (typeof datum.id !== 'string') return;
        onCategoryClick && onCategoryClick(datum.id);
      }}
      className="h-[200px] sm:h-[300px]"
      series={series}
      hideFilter
      loading={loading}
      margin={{ top: 10, right: 0, bottom: 20, left: 50 }}
      gridYValues={5}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues: 5,
      }}
      axisBottom={null}
      // axisBottom={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   truncateTickAt: 0,
      //   tickValues: 5,
      // }}
    />
  );
}
