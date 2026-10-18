import { Pip } from './mascot';

interface ScanLogoProps {
  size?: number;
}

/** The brand mark: Pip's head. */
export function ScanLogo({ size = 48 }: ScanLogoProps) {
  return <Pip head size={size} title="Receipt Ranger" />;
}
