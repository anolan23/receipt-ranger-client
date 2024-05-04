import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { ResponsivePie } from '@nivo/pie';
import { Loader } from '../loader';
import { NivoData, NivoPieChartProps } from './interfaces';

export function NivoPieChart<T extends number | string>({
  series,
  loading,
  className,
  ...props
}: NivoPieChartProps<T>) {
  const [filterValue, setFilterValue] = useState<string[]>([]);

  useEffect(() => {
    if (series.length) {
      setFilterValue(series.map((serie) => serie.title));
    }
  }, [series]);

  const filteredSeries = useMemo(() => {
    return series.filter((serie) => filterValue.includes(serie.title));
  }, [series, filterValue]);

  const nivoData = useMemo(() => {
    return filteredSeries.map((serie) => {
      return serie.data;
    });
  }, [filteredSeries]);

  const isEmpty = !nivoData.length;

  return (
    <div className={cn('h-[300px]', className)}>
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <Loader size={24} />
        </div>
      ) : isEmpty ? (
        <div className="h-full flex justify-center items-center text-sm">
          No chart data
        </div>
      ) : (
        <ResponsivePie
          data={nivoData}
          margin={{ top: 40, right: 10, bottom: 80, left: 10 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
          theme={{
            text: {
              fontFamily: 'inherit',
              fontSize: 12,
              color: 'inherit',
              fill: 'hsl(var(--foreground))',
            },
          }}
          {...props}
        />
      )}
    </div>
  );
}
