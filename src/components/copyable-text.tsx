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
    <div className="group flex items-center gap-2 overflow-hidden text-lg">
      {children}
      <Button
        onClick={copyToClipboard}
        size="icon"
        variant="secondary"
        className="size-11 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
      >
        {isCopied ? (
          <CopyCheck aria-hidden />
        ) : (
          <>
            <Copy aria-hidden />
            <span className="sr-only">Copy text</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default CopyableText;
