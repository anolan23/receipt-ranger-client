import { useEffect, useMemo, useState } from 'react';

import { ResponsiveBar } from '@nivo/bar';

import { cn } from '@/lib/utils';
import { StatusIndicator } from '../status-indicator';
import { Label } from '../ui/label';
import { Filter } from './filter';
import { NivoBarChartProps, NivoData } from './interfaces';

export function NivoBarChart<T extends number | string>({
  series,
  hideFilter,
  loading,
  className,
  ...props
}: NivoBarChartProps<T>) {
  const [filterValue, setFilterValue] = useState<string[]>([]);

  useEffect(() => {
    if (series.length) {
      setFilterValue(series.map((serie) => serie.title));
    }
  }, [series]);

  const showFilter = !hideFilter;
  const selectItems: { value: string; label: string }[] = useMemo(() => {
    return series.map((serie) => {
      return { label: serie.title, value: serie.title };
    });
  }, [series]);

  const filteredSeries = useMemo(() => {
    return series.filter((serie) => filterValue.includes(serie.title));
  }, [series, filterValue]);

  const nivoData = useMemo(() => {
    const data = filteredSeries.reduce((acc: NivoData[], serie) => {
      serie.data.forEach((dataPoint) => {
        const existingDataPoint = acc.find((d) => d.x === dataPoint.x);

        if (existingDataPoint) {
          existingDataPoint[serie.title] = dataPoint.y;
        } else {
          acc.push({ x: dataPoint.x, [serie.title]: dataPoint.y });
        }
      });

      return acc;
    }, []);

    // Create an object to store the data points by category
    const dataByCategory: { [key: string]: NivoData } = {};
    data.forEach((d) => {
      dataByCategory[d.x as string] = d;
    });

    // Populate the initialData array with the corresponding data points
    const populatedData = data.map((d) => {
      return { ...d, ...dataByCategory[d.x as string] };
    });

    return populatedData;
  }, [filteredSeries]);

  const keys = useMemo(() => {
    const uniqueKeys = new Set<string>();
    series.forEach((serie) => {
      serie.data.forEach((dataPoint) => {
        uniqueKeys.add(serie.title);
      });
    });
    return Array.from(uniqueKeys).sort((a, b) => b.localeCompare(a));
  }, [series]);

  const isEmpty = !nivoData.length;

  return (
    <div className={cn('h-[300px]', className)}>
      {showFilter && (
        <div className="flex flex-wrap mb-5">
          <div className="flex-grow-0 flex-shrink basis-[280px] space-y-2 flex flex-col">
            <Label>Filter by document year</Label>
            <Filter
              items={selectItems}
              value={filterValue}
              onValueChange={setFilterValue}
            />
          </div>
        </div>
      )}
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <StatusIndicator status="loading">Loading</StatusIndicator>
        </div>
      ) : isEmpty ? (
        <div className="h-full flex justify-center items-center text-sm">
          No data for the selected Date range
        </div>
      ) : (
        <ResponsiveBar
          data={nivoData}
          keys={keys}
          groupMode="stacked"
          motionConfig="stiff"
          indexBy="x"
          margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
          borderRadius={4}
          padding={0.1}
          valueScale={{ type: 'linear' }}
          valueFormat=">-$.2f"
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          theme={{
            text: {
              fontFamily: 'inherit',
              fontSize: 12,
              color: 'inherit',
              fill: 'hsl(var(--foreground))',
            },
            grid: {
              line: {
                stroke: 'hsl(var(--border))',
              },
            },
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Total ($)',
            legendPosition: 'middle',
            legendOffset: -50,
            truncateTickAt: 0,
          }}
          labelSkipWidth={48}
          labelSkipHeight={16}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          role="application"
          ariaLabel="Spending Explorer"
          barAriaLabel={(e) =>
            e.id + ': ' + e.formattedValue + ' in time period: ' + e.indexValue
          }
          {...props}
        />
      )}
    </div>
  );
}
