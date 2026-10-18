import { useEffect, useMemo, useState } from 'react';

import { ResponsiveBar } from '@nivo/bar';

import { cn } from '@/lib/utils';
import { LoadingState } from '../loading-state';
import { Label } from '../ui/label';
import { Filter } from './filter';
import { chartTheme, MARK_OUTLINE, MARK_OUTLINE_WIDTH } from './chart-theme';
import { ChartTooltip } from './chart-tooltip';
import { assignCategoryColors } from '@/lib/categories';
import { NivoBarChartProps, NivoData } from './interfaces';

export function NivoBarChart<T extends number | string>({
  series,
  hideFilter,
  loading,
  className,
  highlightIndex,
  categoryColors,
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

  const categoryStyles = useMemo(
    () => (categoryColors ? assignCategoryColors(keys) : undefined),
    [categoryColors, keys]
  );

  return (
    <div className={cn('h-[300px]', className)}>
      {showFilter && (
        <div className="flex flex-wrap mb-5">
          <div className="grow-0 shrink basis-[280px] space-y-2 flex flex-col">
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
        <div className="flex h-full items-center justify-center">
          <LoadingState />
        </div>
      ) : isEmpty ? (
        <div className="flex h-full items-center justify-center text-center text-sm text-ink-muted">
          Nothing scanned in this date range yet
        </div>
      ) : (
        <ResponsiveBar
          data={nivoData}
          keys={keys}
          groupMode="stacked"
          motionConfig="stiff"
          indexBy="x"
          margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
          borderRadius={8}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          valueFormat=">-$,.2f"
          indexScale={{ type: 'band', round: true }}
          colors={(bar) => {
            if (categoryStyles)
              return (categoryStyles[String(bar.id)] ?? categoryStyles[keys[0]])
                .color;
            if (highlightIndex !== undefined)
              return bar.indexValue === highlightIndex
                ? 'var(--primary)'
                : 'var(--blob-peach)';
            return 'var(--blob-peach)';
          }}
          borderColor={MARK_OUTLINE}
          borderWidth={MARK_OUTLINE_WIDTH}
          theme={chartTheme}
          enableGridX={false}
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
            format: (value: number | string) => `$${value}`,
            truncateTickAt: 0,
          }}
          enableLabel={false}
          role="application"
          ariaLabel="Spending chart"
          barAriaLabel={(e) =>
            e.id + ': ' + e.formattedValue + ' in time period: ' + e.indexValue
          }
          tooltip={(bar) => (
            <ChartTooltip
              title={bar.indexValue}
              value={bar.formattedValue}
              swatch={bar.color}
              note={
                categoryStyles
                  ? undefined
                  : bar.id !== bar.indexValue
                  ? String(bar.id)
                  : undefined
              }
            />
          )}
          animate={true}
          layout="vertical"
          {...props}
        />
      )}
    </div>
  );
}
