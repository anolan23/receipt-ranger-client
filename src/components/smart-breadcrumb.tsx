import { Link, useLocation } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import React from 'react';
interface Route {
  path: string;
  label: string;
}

interface SmartBreadcrumbProps {
  excludedPathname?: string;
}
const SmartBreadcrumb = ({
  excludedPathname = 'dashboard',
}: SmartBreadcrumbProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const filteredPathnames = pathnames.filter(
    (name) => name !== excludedPathname
  );

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {filteredPathnames.map((name, index) => {
          const key = `${name}_${index}`;
          const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === filteredPathnames.length - 1;
          return isLast ? (
            <React.Fragment key={key}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="first-letter:uppercase">
                  {name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          ) : (
            <React.Fragment key={key}>
              <BreadcrumbSeparator />
              <BreadcrumbItem key={name}>
                <BreadcrumbLink asChild>
                  <Link to={routeTo} className="first-letter:uppercase">
                    {name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SmartBreadcrumb;
