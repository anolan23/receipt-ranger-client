import type { BarDatum, ResponsiveBarSvgProps } from '@nivo/bar';

type Theme = NonNullable<ResponsiveBarSvgProps<BarDatum>['theme']>;

/**
 * Nivo theme in Receipt Ranger tokens. Colours are CSS variables so charts
 * follow the cream and plum themes. Axis labels are 12px bold `ink-muted`.
 */
export const chartTheme: Theme = {
  text: {
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 700,
    fill: 'var(--ink-muted)',
  },
  axis: {
    ticks: {
      text: { fill: 'var(--ink-muted)', fontSize: 12, fontWeight: 700 },
      line: { stroke: 'var(--line)' },
    },
    domain: { line: { stroke: 'var(--line)', strokeWidth: 1 } },
    legend: {
      text: { fill: 'var(--ink-muted)', fontSize: 12, fontWeight: 700 },
    },
  },
  grid: {
    line: { stroke: 'var(--line)', strokeWidth: 1, strokeDasharray: '4 4' },
  },
  labels: {
    text: { fill: 'var(--ink)', fontWeight: 700, fontSize: 12 },
  },
};

/** Sticker outline on chart marks so pastels stay visible. */
export const MARK_OUTLINE = 'var(--ink)';
export const MARK_OUTLINE_WIDTH = 2;
