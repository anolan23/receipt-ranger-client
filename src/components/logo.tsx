import { ScanText } from 'lucide-react';

interface LogoProps {
  fill?: string;
}

export function Logo({ fill, ...props }: LogoProps) {
  return (
    <div className="flex space-x-2 items-center">
      <ScanText fill={fill} />
      <span className="font-bold tracking-tighter">snapceipt.</span>
    </div>
  );
}
