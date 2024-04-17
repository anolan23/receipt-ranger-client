import LogoSVG from '@/assets/logo.svg?react';

interface ScanLogoProps {
  size?: number;
  fill?: string;
}

export function ScanLogo({
  size = 24,
  fill = 'hsl(var(--foreground))',

  ...props
}: ScanLogoProps) {
  return <LogoSVG fill={fill} width={size} height={size} stroke={fill} />;
}
