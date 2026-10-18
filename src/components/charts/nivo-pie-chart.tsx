import { useMemo, useState } from 'react';

import { PieCustomLayerProps, ResponsivePie } from '@nivo/pie';

import { assignCategoryColors, CATEGORY_STYLES } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { LoadingState } from '../loading-state';
import { MARK_OUTLINE, MARK_OUTLINE_WIDTH } from './chart-theme';
import { ChartTooltip } from './chart-tooltip';
import { NivoPieChartProps } from './interfaces';

const FALLBACK_COLORS = [
  CATEGORY_STYLES.groceries,
  CATEGORY_STYLES.kids,
  CATEGORY_STYLES.eating,
  CATEGORY_STYLES.home,
  CATEGORY_STYLES.school,
  CATEGORY_STYLES.other,
];

/**
 * Donut with a full legend. Hovering (or focusing) a slice scales it up and
 * swaps the centre to that slice's emoji, amount and percent.
 */
export function NivoPieChart<T extends number | string>({
  series,
  loading,
  className,
  formatValue = (value) => String(value),
  categoryColors,
  centerLabel = 'Total',
}: NivoPieChartProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const data = useMemo(
    () =>
      series.map((serie) => ({
        id: serie.data.id,
        label: serie.data.label,
        value: Number(serie.data.value),
      })),
    [series]
  );

  const total = useMemo(
    () => data.reduce((sum, datum) => sum + datum.value, 0),
    [data]
  );

  const styles = useMemo(() => {
    if (categoryColors) return assignCategoryColors(data.map((d) => d.label));
    return Object.fromEntries(
      data.map((d, i) => [d.label, FALLBACK_COLORS[i % FALLBACK_COLORS.length]])
    );
  }, [data, categoryColors]);

  const percent = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;
  const active = data.find((d) => d.id === activeId);

  const CenterLayer = ({ centerX, centerY }: PieCustomLayerProps<(typeof data)[number]>) => (
    <g transform={`translate(${centerX}, ${centerY})`} textAnchor="middle">
      {active ? (
        <>
          <text y={-14} fontSize={26} style={{ fill: 'initial' }}>
            {styles[active.label]?.emoji}
          </text>
          <text y={10} fontSize={18} fontWeight={700} className="num" style={{ fill: 'var(--ink)' }}>
            {formatValue(active.value)}
          </text>
          <text y={28} fontSize={12} fontWeight={700} style={{ fill: 'var(--ink-muted)' }}>
            {percent(active.value)}%
          </text>
        </>
      ) : (
        <>
          <text y={4} fontSize={22} fontWeight={700} className="num" style={{ fill: 'var(--ink)' }}>
            {formatValue(total)}
          </text>
          <text y={24} fontSize={12} fontWeight={700} style={{ fill: 'var(--ink-muted)' }}>
            {centerLabel}
          </text>
        </>
      )}
    </g>
  );

  if (loading) {
    return (
      <div className={cn('flex min-h-48 items-center justify-center', className)}>
        <LoadingState />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          'flex min-h-48 items-center justify-center text-center text-sm text-ink-muted',
          className
        )}
      >
        Nothing to chart yet
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', className)}>
      <div className="mx-auto h-60 w-full max-w-72">
        <ResponsivePie
          data={data}
          margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
          innerRadius={0.62}
          padAngle={1.5}
          cornerRadius={6}
          activeOuterRadiusOffset={6}
          borderWidth={MARK_OUTLINE_WIDTH}
          borderColor={MARK_OUTLINE}
          colors={(d) => styles[String(d.data.label)]?.color ?? 'var(--cat-other)'}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          layers={['arcs', CenterLayer]}
          onMouseEnter={(d) => setActiveId(String(d.id))}
          onMouseLeave={() => setActiveId(null)}
          tooltip={({ datum }) => (
            <ChartTooltip
              title={datum.label}
              value={formatValue(datum.value)}
              note={`${percent(datum.value)}% of the total`}
              swatch={datum.color}
            />
          )}
          theme={{
            text: { fontFamily: 'var(--font-sans)', fill: 'var(--ink)' },
          }}
        />
      </div>
      <ul className="grid gap-0.5">
        {data.map((datum) => (
          <li
            key={datum.id}
            onMouseEnter={() => setActiveId(String(datum.id))}
            onMouseLeave={() => setActiveId(null)}
            className="flex min-h-9 items-center gap-2.5 text-sm"
          >
            <span
              aria-hidden
              className="size-4 shrink-0 rounded-full border-2 border-ink"
              style={{ background: styles[datum.label]?.color }}
            />
            <span className="flex-1 truncate font-bold">
              {categoryColors && (
                <span aria-hidden className="mr-1.5">
                  {styles[datum.label]?.emoji}
                </span>
              )}
              {datum.label}
            </span>
            <span className="num w-10 text-right font-bold">
              {percent(datum.value)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
