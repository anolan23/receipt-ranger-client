import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadIcon } from '@radix-ui/react-icons';
import { Analytics } from './components/analytics';
import { Overview } from './components/overview';
import { Header } from '@/components/header';

interface DashboardProps {}

export function Dashboard({ ...props }: DashboardProps) {
  return (
    <>
      <Header
        title="Dashboard"
        actions={
          <Button asChild>
            <Link to="/upload">
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload receipt
            </Link>
          </Button>
        }
      />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          Reports
        </TabsContent>
      </Tabs>
    </>
  );
}
