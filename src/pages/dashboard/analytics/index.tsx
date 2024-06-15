import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { AnalyticsContentLayout } from './components/analytics-content';

interface AnalyticsProps {}

export function AnalyticsPage({ ...props }: AnalyticsProps) {
  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={<AnalyticsContentLayout />}
    />
  );
}
