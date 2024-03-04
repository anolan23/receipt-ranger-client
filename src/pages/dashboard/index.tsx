import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReceipts } from '@/hooks/use-receipts';
import { CornersIcon } from '@radix-ui/react-icons';
import { Overview } from './components/overview';

interface DashboardProps {}

export function Dashboard({ ...props }: DashboardProps) {
  const { data: receipts } = useReceipts();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button>
          <CornersIcon className="mr-2 h-4 w-4" /> Scan receipt
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview receipts={receipts} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          Analytics
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
