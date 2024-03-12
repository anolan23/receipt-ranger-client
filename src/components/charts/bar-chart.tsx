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
import { BarChartProps } from './interfaces';
import { Select } from '../select';
import { Label } from '../ui/label';
import { useMemo, useState } from 'react';
import { Filter } from './filter';

export function BarChart<T extends number | string | Date>({
  series,
  hideFilter,
  hideLegend,
  ...props
}: BarChartProps<T>) {
  const [selectedItem, setSelectedItem] = useState('');
  const showFilter = !hideFilter;
  const showLegend = !hideLegend;
  const selectItems: { value: string; label: string }[] = useMemo(() => {
    return series.map((serie) => {
      return { label: serie.title, value: serie.title };
    });
  }, [series]);

  const data = useMemo(() => {
    const serie = series.find((s) => s.title === selectedItem);
    return serie?.data;
  }, [series, selectedItem]);

  return (
    <div>
      {showFilter && (
        <div className="flex flex-wrap mb-5">
          <div className="flex-grow-0 flex-shrink basis-[280px] space-y-2 flex flex-col">
            <Label>Filter displayed data</Label>
            {/* <Select
              items={selectItems}
              placeholder="Filter data"
              value={selectedItem}
              onValueChange={setSelectedItem}
            /> */}
            <Filter />
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChartPrimitive
          height={300}
          data={data || []}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid horizontal vertical={false} />
          <XAxis dataKey="x" fontSize={12} />
          <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
          <Tooltip labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
          {showLegend && <Legend iconSize={12} fontSize={12} />}
          <Bar
            dataKey="y"
            stackId="a"
            fill={`hsl(var(--primary))`}
            radius={[4, 4, 0, 0]}
          />
        </BarChartPrimitive>
      </ResponsiveContainer>
    </div>
  );
}
