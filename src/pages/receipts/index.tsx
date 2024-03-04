import { useReceipts } from '@/hooks/use-receipts';
import { ReceiptsTable } from './components/receipts-table';

interface ReceiptsPageProps {}

export function ReceiptsPage({ ...props }: ReceiptsPageProps) {
  const { data: receipts } = useReceipts();

  return (
    <>
      <div className="flex items-center space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Receipts</h2>
          <p className="text-muted-foreground">
            Here's a list of your scanned receipts
          </p>
        </div>
      </div>
      <ReceiptsTable receipts={receipts} />
    </>
  );
}
