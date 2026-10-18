import { BarDatum, ResponsiveBarSvgProps } from '@nivo/bar';
import { PieSvgProps } from '@nivo/pie';

export interface Datum<T> {
  x: T;
  y: number;
}

interface PieData<T = number> {
  id: string;
  label: string;
  value: T;
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

export interface PieDataSeries<T> {
  type: 'pie';
  title: string;
  color?: string;

  // This makes sure that the element type of the array is reduced to just one type,
  // even if `T` is a union type, e.g. `number | string`.
  data: PieData<T>;
}

export type BarSeries<T> = BarDataSeries<T>;
export type PieSeries<T> = PieDataSeries<T>;

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
  /** Index value (x label) of the bar to draw in `primary`, e.g. the current month. */
  highlightIndex?: string;
  /** Colour each series with its fixed category colour instead of a single tone. */
  categoryColors?: boolean;
}

export interface NivoPieChartProps<T extends ChartDataTypes> {
  series: PieSeries<T>[];
  loading?: boolean;
  className?: string;
  /** Format a slice value for the centre label and legend. */
  formatValue?: (value: number) => string;
  /** Fixed per-category colours, with emoji and name in the legend. */
  categoryColors?: boolean;
  /** Label under the total in the centre of the donut. */
  centerLabel?: string;
}

export type ChartDataTypes = number | string | Date;
