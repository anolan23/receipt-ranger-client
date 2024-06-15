interface RadialProgressBarProps {
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
}

export function RadialProgressBar({
  value,
  size,
  strokeWidth,
  color,
}: RadialProgressBarProps) {
  const viewBox = `0 0 ${size} ${size}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (value * circumference) / 100;

  return (
    <svg width={size} height={size} viewBox={viewBox}>
      <circle
        fill="none"
        stroke="#ccc"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        fill="none"
        stroke={color}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        style={{ transition: 'all 0.5s' }}
      />
      <text
        fill={color}
        fontSize="16px"
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
      >
        {`${value}%`}
      </text>
    </svg>
  );
}
