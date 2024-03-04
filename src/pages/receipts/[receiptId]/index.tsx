import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import wfm from '@/assets/wfm.png';
import { ReceiptItemsDataTable } from './components/receipt-items-data-table';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import { useParams } from 'react-router-dom';
import { useReceipt } from '@/hooks/use-receipt';
import dayjs from 'dayjs';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();
  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  if (!receipt) return <div>Loading...</div>;
  const date = dayjs(receipt.transaction_date).format('MMM D, YYYY');
  return (
    <>
      <div className="flex items-center space-y-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={wfm} className="grayscale" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold tracking-tight">
            {`${receipt.store_name}, ${date} - $${receipt.total_amount}`}
          </h2>
        </div>
        <div className="flex items-center space-x-3 ml-auto">
          <Button variant="outline">View receipt</Button>
          <Button>Receipt actions</Button>
        </div>
      </div>
      <Tabs defaultValue="receipt-data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receipt-data">Receipt data</TabsTrigger>
          <TabsTrigger value="store-info">Store information</TabsTrigger>
          <TabsTrigger value="ocr-text">OCR text</TabsTrigger>
        </TabsList>
        <TabsContent value="receipt-data" className="space-y-4">
          <ReceiptItemsDataTable items={items} />
        </TabsContent>
        <TabsContent value="store-info" className="space-y-4">
          Store information
        </TabsContent>
        <TabsContent value="ocr-text" className="space-y-4">
          OCR text
        </TabsContent>
      </Tabs>
    </>
  );
}
