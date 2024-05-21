import { Copy, CopyCheck } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';

interface CopyableTextProps {
  text: string;
  children?: ReactNode;
}

export function CopyableText({ text, children }: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
      });
    } else {
      console.error('Clipboard API not supported');
    }
  }, [text]);

  useEffect(() => {
    let timeoutId: any;

    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopied]);

  return (
    <div className="group flex items-center gap-2 text-lg overflow-hidden">
      {children}
      <Button
        onClick={copyToClipboard}
        size="icon"
        variant="outline"
        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {isCopied ? (
          <CopyCheck className="h-3 w-3" />
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copy text</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default CopyableText;
