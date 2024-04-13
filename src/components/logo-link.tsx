import { Link } from 'react-router-dom';
import { Logo } from './logo';

interface LogoLinkProps {}

export function LogoLink({ ...props }: LogoLinkProps) {
  return (
    <Link to="/dashboard" className="flex space-x-2 items-center">
      <Logo />
      <span className="font-bold tracking-tighter">snapceipt.</span>
    </Link>
  );
}
