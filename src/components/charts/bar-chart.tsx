import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart as BarChartPrimitive,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Label } from '../ui/label';
import { Filter } from './filter';
import { BarChartProps, RechartsData } from './interfaces';

export function BarChart<T extends number | string | Date>({
  series,
  hideFilter,
  hideLegend,
  stackedBars,
  xDomain,
  height = 300,
  ...props
}: BarChartProps<T>) {
  const [filterValue, setFilterValue] = useState<string[]>([]);

  useEffect(() => {
    if (series.length) {
      setFilterValue(series.map((serie) => serie.title));
    }
  }, [series]);

  const showFilter = !hideFilter;
  const showLegend = !hideLegend;
  const selectItems: { value: string; label: string }[] = useMemo(() => {
    return series.map((serie) => {
      return { label: serie.title, value: serie.title };
    });
  }, [series]);

  const filteredSeries = useMemo(() => {
    return series.filter((serie) => filterValue.includes(serie.title));
  }, [series, filterValue]);

  const rechartsData = useMemo(() => {
    const data = filteredSeries.reduce((acc: RechartsData[], serie) => {
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

    // Initialize an array based on xDomain
    const initialData = xDomain
      ? xDomain.map((category) => ({ x: category }))
      : data;

    // Create an object to store the data points by category
    const dataByCategory: { [key: string]: RechartsData } = {};
    data.forEach((d) => {
      dataByCategory[d.x as string] = d;
    });

    // Populate the initialData array with the corresponding data points
    const populatedData = initialData.map((d) => {
      return { ...d, ...dataByCategory[d.x as string] };
    });

    return populatedData;
  }, [filteredSeries, xDomain]);

  console.log(rechartsData);

  return (
    <div>
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
      <ResponsiveContainer width="100%" height={height}>
        <BarChartPrimitive
          height={height}
          data={rechartsData || []}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid horizontal vertical={false} />
          <XAxis dataKey="x" fontSize={12} domain={xDomain} />
          <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
          <Tooltip labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
          {showLegend && (
            <Legend
              iconSize={12}
              iconType="square"
              fontSize={12}
              align="left"
            />
          )}
          {/* <Bar
            dataKey="y"
            stackId="a"
            fill={`hsl(var(--primary))`}
            radius={[4, 4, 0, 0]}
          /> */}
          {filteredSeries.map((serie, i) => (
            <Bar
              key={i}
              dataKey={serie.title}
              // fill={`hsl(var(--primary)`}
              fill={serie.color}
              radius={4}
              stackId={stackedBars ? 'a' : undefined}
              barSize={100}
            />
          ))}
        </BarChartPrimitive>
      </ResponsiveContainer>
    </div>
  );
}
