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
        className="flex w-full items-center gap-3 rounded-md bg-surface-200 p-3 text-left transition-colors hover:bg-primary-soft disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-outline bg-[#fffdf8] text-[#755d56]">
          {!src ? (
            <FileQuestion className="h-5 w-5" />
          ) : thumb === 'error' ? (
            <ImageOff className="h-5 w-5" />
          ) : (
            <>
              {thumb === 'loading' ? (
                <span className="skeleton absolute inset-0 rounded-none" />
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
          <span className="block text-sm font-bold">Original receipt</span>
          <span className="block text-xs text-ink-muted">
            {src
              ? 'Tap to take a closer look'
              : 'No photo saved for this receipt'}
          </span>
        </span>
        {src ? <Maximize2 className="h-4 w-4 text-ink-muted" /> : null}
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
