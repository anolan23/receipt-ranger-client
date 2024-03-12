interface Datum<T> {
  x: T;
  y: number;
}

export interface BarDataSeries<T> {
  type: 'bar';
  title: string;
  color?: string;

  // This makes sure that the element type of the array is reduced to just one type,
  // even if `T` is a union type, e.g. `number | string`.
  data: T extends unknown ? Datum<T>[] : Datum<T>[];
}

export type BarSeries<T> = BarDataSeries<T>;

export interface BarChartProps<T extends ChartDataTypes> {
  series: BarSeries<T>[];
  hideFilter?: boolean;
  hideLegend?: boolean;
  visibleSeries?: BarSeries<T>[];
  onFilterChange?: (visibleSeries: BarSeries<T>[]) => void;
}

export type ChartDataTypes = number | string | Date;
