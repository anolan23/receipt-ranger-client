import { useEffect, useMemo, useState } from 'react';

import { ResponsiveBar } from '@nivo/bar';

import { Label } from '../ui/label';
import { Filter } from './filter';
import { NivoBarChartProps, NivoData, RechartsData } from './interfaces';

export function NivoBarChart<T extends number | string>({
  series,
  hideFilter,
  height = 300,
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

  console.log(nivoData);

  const keys = useMemo(() => {
    const uniqueKeys = new Set<string>();
    series.forEach((serie) => {
      serie.data.forEach((dataPoint) => {
        uniqueKeys.add(serie.title);
      });
    });
    return Array.from(uniqueKeys);
  }, [series]);

  return (
    <div style={{ height }}>
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
      <ResponsiveBar
        data={nivoData}
        keys={keys}
        groupMode="stacked"
        indexBy="x"
        margin={{ top: 10, right: 170, bottom: 50, left: 60 }}
        padding={0.5}
        innerPadding={2}
        borderRadius={2}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'country',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'food',
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Spending Explorer"
        barAriaLabel={(e) =>
          e.id + ': ' + e.formattedValue + ' in time period: ' + e.indexValue
        }
        {...props}
      />
    </div>
  );
}
