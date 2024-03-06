import wfm from '@/assets/wfm.png';
import { DeleteReceiptMenuItem } from '@/components/delete-receipt-menu-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { ReceiptItemsDataTable } from './components/receipt-items-data-table';
import { ReceiptData } from '@/lib/types';
import { deleteReceipt } from '@/lib/api/receipts';
import { useToast } from '@/components/ui/use-toast';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  if (!receipt) return <div>Loading...</div>;
  const date = dayjs(receipt.transaction_date).format('MMM D, YYYY');

  const handleDeleteSubmit = async function (receipt: ReceiptData) {
    try {
      if (!receipt?.id) return;
      await deleteReceipt(receipt.id);
      navigate('/receipts');
      toast({
        description: 'Receipt deleted',
      });
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        description: message,
      });
    }
  };
  return (
    <>
      <div className="flex items-center space-y-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={wfm} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold tracking-tight">
            {`${receipt.store_name}, ${date} - $${receipt.total_amount}`}
          </h2>
        </div>
        <div className="flex items-center space-x-3 ml-auto">
          <Button variant="outline">View receipt</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Receipt actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View receipt</DropdownMenuItem>
              <DeleteReceiptMenuItem
                receipt={receipt}
                onDeleteSubmit={handleDeleteSubmit}
              />
            </DropdownMenuContent>
          </DropdownMenu>
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
