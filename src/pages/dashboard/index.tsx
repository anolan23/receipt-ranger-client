import { Link } from '@/components/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combo-box';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CornersIcon } from '@radix-ui/react-icons';
import { Overview } from './components/overview';

interface DashboardProps {}

export function Dashboard({ ...props }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 border-b">
        <Combobox />
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link to="/dashboard">Overview</Link>
          <Link to="/scanner">Scanner</Link>
          <Link to="/calculators">Calculators</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Input
            className="md:w-[100px] lg:w-[300px]"
            placeholder="Search..."
          />
          <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
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
            <Overview />
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
      </main>
    </div>
  );
}
