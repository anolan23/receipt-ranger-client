import { PureComponent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { name: 'Jan', category1: 743, category2: 2400 },
  { name: 'Feb', category1: 564, category2: 1398 },
  { name: 'Mar', category1: 879, category2: 9800 },
  { name: 'Apr', category1: 456, category2: 3908 },
  { name: 'May', category1: 878, category2: 4800 },
  { name: 'Jun', category1: 1000, category2: 3800 },
  { name: 'Jul', category1: 988, category2: 4300 },
  { name: 'Aug', category1: 768, category2: 2400 },
  { name: 'Sep', category1: 987, category2: 1398 },
  { name: 'Oct', category1: 678, category2: 9800 },
  { name: 'Nov', category1: 888, category2: 3908 },
  { name: 'Dec', category1: 751, category2: 4800 },
];

export default class StackedBarChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="category1"
            stackId="a"
            fill={`hsl(var(--primary))`}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
