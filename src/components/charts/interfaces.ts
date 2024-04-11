import { BarDatum, ResponsiveBarSvgProps } from '@nivo/bar';

export interface Datum<T> {
  x: T;
  y: number;
}

export type RechartsData = {
  [key: string]: ChartDataTypes;
};
export type NivoData = {
  [key: string]: number | string;
};

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
  stackedBars?: boolean;
  xDomain?: string[];
  height?: number;
}

export interface NivoBarChartProps<T extends ChartDataTypes>
  extends Omit<ResponsiveBarSvgProps<BarDatum>, 'data'> {
  series: BarSeries<T>[];
  hideFilter?: boolean;
  loading?: boolean;
  className?: string;
}

export type ChartDataTypes = number | string | Date;
