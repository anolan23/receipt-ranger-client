import { Link } from 'react-router-dom';
import { ScanLogo } from './scan-logo';

interface LogoProps {
  fill?: string;
}

export function Logo({ fill, ...props }: LogoProps) {
  return (
    <div className="flex space-x-2 items-center">
      <ScanLogo fill={fill} />
      <span className="font-bold tracking-tighter">snapceipt.</span>
    </div>
  );
}
