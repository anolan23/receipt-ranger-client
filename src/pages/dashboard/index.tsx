import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReceipts } from '@/hooks/use-receipts';
import { UploadIcon } from '@radix-ui/react-icons';
import { Overview } from './components/overview';
import { Link } from '@/components/link';
import { useMonthlySpending } from '@/hooks/use-monthly-spending';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { Analytics } from './components/analytics';

interface DashboardProps {}

export function Dashboard({ ...props }: DashboardProps) {
  const { data: receipts } = useReceipts();
  const { data: monthlySpending } = useMonthlySpending(
    new Date().getFullYear()
  );
  const { data: spendingOverview } = useSpendingOverview();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link to="/upload">
            <UploadIcon className="mr-2 h-4 w-4" /> Upload receipt
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview
            receipts={receipts}
            monthlySpending={monthlySpending}
            spendingOverview={spendingOverview}
          />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          Reports
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          Notifications
        </TabsContent>
      </Tabs>
    </>
  );
}
