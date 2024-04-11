import LogoSVG from '@/assets/logo.svg?react';

interface LogoProps {
  size?: number;
  fill?: string;
}

export function Logo({
  size = 24,
  fill = 'hsl(var(--foreground))',

  ...props
}: LogoProps) {
  return <LogoSVG fill={fill} width={size} height={size} stroke={fill} />;
}
