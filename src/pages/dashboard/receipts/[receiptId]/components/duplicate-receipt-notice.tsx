import { Link } from "@/components/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useReceipt } from "@/hooks/use-receipt";
import { getReceiptTitle } from "@/lib/helpers";
import { CircleAlertIcon } from "lucide-react";

interface DuplicateReceiptNoticeProps {
  originalReceiptId: string;
}

export function DuplicateReceiptNotice({
  originalReceiptId,
}: DuplicateReceiptNoticeProps) {
  const { data: original } = useReceipt(originalReceiptId);
  return (
    <Alert variant="rise">
      <CircleAlertIcon aria-hidden />
      <AlertTitle>Possible duplicate</AlertTitle>
      <AlertDescription>
        This receipt looks a lot like{" "}
        <Link to={`/dashboard/receipts/${originalReceiptId}`}>
          {original ? getReceiptTitle(original) : "an earlier receipt"}
        </Link>
        .
      </AlertDescription>
    </Alert>
  );
}
