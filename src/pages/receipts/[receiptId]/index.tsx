import { DeleteReceiptDialog } from '@/components/delete-receipt-dialog';
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
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  const calculatedTotal = useMemo(() => {
    if (!items) return;
    return items.reduce((prev, curr) => +(curr.total_price || 0) + prev, 0);
  }, [items])?.toFixed(2);

  if (!receipt) return <div>Loading...</div>;
  const date = dayjs(receipt.transaction_date).format('MMM D, YYYY');

  function handleDialogItemOpenChange(open: boolean) {
    if (open === false) {
      setDropdownOpen(false);
      //Because of dropdown content exit animation
      setTimeout(() => setHasOpenDialog(false), 1000);
    } else {
      setHasOpenDialog(open);
    }
  }

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
            <AvatarImage src={receipt.merchant.logo_url || undefined} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold tracking-tight">
            {`${receipt.merchant.name}, ${date} - $${receipt.total_amount}`}
          </h2>
        </div>
        <div className="flex items-center space-x-3 ml-auto">
          <Button variant="outline">View receipt</Button>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button>Receipt actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent hidden={hasOpenDialog}>
              <DropdownMenuItem>View receipt</DropdownMenuItem>
              <DeleteReceiptDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                }
                receipt={receipt}
                onDeleteSubmit={handleDeleteSubmit}
                onOpenChange={handleDialogItemOpenChange}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs defaultValue="receipt-data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receipt-data">Receipt data</TabsTrigger>
          <TabsTrigger value="merchant-info">Merchant information</TabsTrigger>
          <TabsTrigger value="ocr-text">OCR text</TabsTrigger>
        </TabsList>
        <TabsContent value="receipt-data" className="space-y-4">
          <ReceiptItemsDataTable items={items} />
          <div>Calculated Subtotal: ${calculatedTotal}</div>
        </TabsContent>
        <TabsContent value="merchant-info" className="space-y-4">
          Merchant information
        </TabsContent>
        <TabsContent value="ocr-text" className="space-y-4">
          <Card className=" w-min">
            <CardContent className="p-6">
              <pre>
                <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-xs">
                  {receipt.ocr_text}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
