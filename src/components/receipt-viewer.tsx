import { FileQuestion, ImageOff, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Download from 'yet-another-react-lightbox/plugins/download';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

interface ReceiptViewerProps {
  imageUrl?: string | null;
}

export function ReceiptViewer({ imageUrl }: ReceiptViewerProps) {
  const [open, setOpen] = useState(false);
  const [thumb, setThumb] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Signed, expiring path from the API; works in a plain <img> without the JWT
  const src = imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
    : undefined;

  useEffect(() => setThumb('loading'), [src]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!src}
        className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted text-muted-foreground">
          {!src ? (
            <FileQuestion className="h-5 w-5" />
          ) : thumb === 'error' ? (
            <ImageOff className="h-5 w-5" />
          ) : (
            <>
              {thumb === 'loading' ? (
                <span className="absolute inset-0 animate-pulse bg-muted" />
              ) : null}
              <img
                src={src}
                alt=""
                onLoad={() => setThumb('loaded')}
                onError={() => setThumb('error')}
                className="h-full w-full object-cover object-top"
              />
            </>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">Original receipt</span>
          <span className="block text-xs text-muted-foreground">
            {src
              ? 'Tap to compare with the details below'
              : 'No image for this receipt'}
          </span>
        </span>
        {src ? <Maximize2 className="h-4 w-4 text-muted-foreground" /> : null}
      </button>
      {src ? (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={[{ src, download: src }]}
          plugins={[Zoom, Download]}
          carousel={{ finite: true }}
          controller={{ closeOnBackdropClick: true }}
          zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
        />
      ) : null}
    </>
  );
}
