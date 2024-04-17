import { DeleteReceiptDialog } from '@/components/delete-receipt-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReceiptItemsDataTable } from './components/receipt-items-data-table';
import { ReceiptData } from '@/lib/types';
import { deleteReceipt } from '@/lib/api/receipts';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layout/dashboard-layout';
import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { ReceiptCard } from '@/components/receipt-card';
import { MoreVertical, ReceiptText } from 'lucide-react';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  const navigate = useNavigate();

  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  const calculatedTotal = useMemo(() => {
    if (!items) return;
    return items.reduce((prev, curr) => +(curr.total_price || 0) + prev, 0);
  }, [items])?.toFixed(2);

  if (!receipt) return <div>Loading...</div>;
  const date = dayjs(receipt.transaction_date).format('MMM D, YYYY');
  const transactionDate = dayjs(receipt.transaction_date).format(
    'MMMM D, YYYY'
  );

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
      toast('Receipt deleted');
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    }
  };
  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4 overflow-hidden">
              <h2 className=" text-xl font-semibold tracking-tight truncate">
                {/* {`${receipt.merchant.name}, ${date} - $${receipt.total_amount}`} */}
                {`Receipt ${receipt.id}`}
              </h2>
            </div>
            <div className="flex items-center space-x-3 ml-auto">
              <Button size="sm" variant="outline" asChild>
                <Link to="edit">Edit Receipt</Link>
              </Button>
              <DropdownMenu
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Receipt actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent hidden={hasOpenDialog}>
                  <DropdownMenuItem asChild>
                    <Link to="edit">Edit receipt</Link>
                  </DropdownMenuItem>
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
              <TabsTrigger value="ocr-text">OCR text</TabsTrigger>
            </TabsList>
            <TabsContent value="receipt-data" className="space-y-4">
              <ReceiptCard
                receipt={receipt}
                headerHidden
                className="max-w-[500px]"
              />
              {/* <div>Calculated Subtotal: ${calculatedTotal}</div> */}
            </TabsContent>
            <TabsContent value="ocr-text" className="space-y-4">
              <Card className="">
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
        </div>
      }
    />
  );
}
