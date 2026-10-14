import { Link } from "@/components/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useReceipt } from "@/hooks/use-receipt";
import { getReceiptTitle } from "@/lib/helpers";
import { Copy } from "lucide-react";

interface DuplicateReceiptNoticeProps {
  originalReceiptId: string;
}

export function DuplicateReceiptNotice({
  originalReceiptId,
}: DuplicateReceiptNoticeProps) {
  const { data: original } = useReceipt(originalReceiptId);
  return (
    <Alert>
      <Copy className="h-4 w-4" />
      <AlertTitle>Possible duplicate</AlertTitle>
      <AlertDescription>
        This receipt looks similar to{" "}
        <Link
          to={`/dashboard/receipts/${originalReceiptId}`}
          className="font-medium underline underline-offset-4"
        >
          {original ? getReceiptTitle(original) : "an earlier receipt"}
        </Link>
        .
      </AlertDescription>
    </Alert>
  );
}
