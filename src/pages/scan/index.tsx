import { Header } from '@/components/header';
import { Pip } from '@/components/mascot';
import { StatusIndicator } from '@/components/status-indicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/use-page-title';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { UsageMeter } from '@/components/usage-meter';
import { usePlan } from '@/hooks/use-plan';
import { useCreateReceipt } from '@/queries/receipts';
import { ScanLimitError } from '@/lib/api/receipts';
import { cn } from '@/lib/utils';
import {
  Camera,
  CameraOff,
  Check,
  ImagePlus,
  RotateCcw,
} from 'lucide-react';
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

type CameraState = 'starting' | 'live' | 'denied' | 'unsupported';
type ItemStatus = 'reading' | 'done' | 'review' | 'failed' | 'blocked';

interface BatchItem {
  id: string;
  file: File;
  url: string;
  status: ItemStatus;
  receiptId?: string;
  message?: string;
}

const TIPS = [
  'Lay it flat and make sure the total is visible',
  'Find some good light, and skip the shadows',
  'Long receipt? Scan it in one go, or in two parts',
];

let counter = 0;

interface ScanLimit {
  limit?: number;
  used?: number;
  resetsAt?: string;
}

function formatResetDate(resetsAt?: string) {
  if (!resetsAt) return undefined;
  const date = new Date(resetsAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Camera-first scanning: viewfinder, big Scan button, photo picker, batch tray. */
export function ScanPage() {
  usePageTitle('Scan');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [camera, setCamera] = useState<CameraState>('starting');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [scanLimit, setScanLimit] = useState<ScanLimit | null>(null);
  const scanLimitRef = useRef<ScanLimit | null>(null);
  const { tier, isLoading: planLoading } = usePlan();
  const createReceipt = useCreateReceipt();

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('unsupported');
      return;
    }
    setCamera('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamera('live');
    } catch {
      setCamera('denied');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  // The video element mounts after the stream exists on some renders.
  useEffect(() => {
    if (camera === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [camera]);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(
    () => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url)),
    []
  );

  const update = (id: string, patch: Partial<BatchItem>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );

  const { mutate: createReceiptMutate } = createReceipt;
  const read = useCallback(
    (item: BatchItem) => {
      update(item.id, { status: 'reading', message: undefined });
      createReceiptMutate(item.file, {
        onSuccess: (result) => {
          update(item.id, {
            status: result.potential_duplicate ? 'review' : 'done',
            receiptId: result.receipt_id,
          });
        },
        onError: (error) => {
          if (error instanceof ScanLimitError) {
            const details = {
              limit: error.limit,
              used: error.used,
              resetsAt: error.resetsAt,
            };
            scanLimitRef.current = details;
            setScanLimit(details);
            update(item.id, { status: 'blocked' });
            return;
          }
          update(item.id, {
            status: 'failed',
            message: error instanceof Error ? error.message : undefined,
          });
        },
      });
    },
    [createReceiptMutate]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const added = files.map<BatchItem>((file) => ({
        id: `scan-${++counter}`,
        file,
        url: URL.createObjectURL(file),
        status: scanLimitRef.current ? 'blocked' : 'reading',
      }));
      if (!added.length) return;
      setItems((prev) => [...prev, ...added]);
      // Once the limit is hit, hold new photos instead of sending more 429s.
      if (!scanLimitRef.current) added.forEach(read);
    },
    [read]
  );

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        addFiles([
          new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' }),
        ]);
      },
      'image/jpeg',
      0.92
    );
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // React Query refetches the plan when the tab regains focus, so upgrading in
  // another tab shows up here without any effect.
  const readHeld = async () => {
    scanLimitRef.current = null;
    setScanLimit(null);
    for (const item of itemsRef.current.filter((i) => i.status === 'blocked')) {
      await read(item);
      if (scanLimitRef.current) break;
    }
  };

  const reading = items.filter((item) => item.status === 'reading').length;
  const blockedCount = items.filter((item) => item.status === 'blocked').length;
  const limitHit = blockedCount > 0 && reading === 0 && !planLoading;
  const finished = items.filter((item) => item.status !== 'reading');
  const doneCount = items.filter(
    (item) => item.status === 'done' || item.status === 'review'
  ).length;
  const allSettled = items.length > 0 && reading === 0 && blockedCount === 0;
  const celebrate = allSettled && doneCount > 0;
  const pipMood = limitHit
    ? 'happy'
    : reading
    ? 'reading'
    : celebrate
    ? 'celebrate'
    : camera === 'denied' || (allSettled && doneCount === 0)
    ? 'oops'
    : 'happy';

  const resetDate = formatResetDate(scanLimit?.resetsAt);
  const headline = limitHit
    ? "You've used your free scans this month"
    : reading
    ? `Reading receipt ${finished.length + 1} of ${items.length}…`
    : celebrate
    ? `Nice, ${doneCount} ${doneCount === 1 ? 'receipt' : 'receipts'} scanned!`
    : allSettled
    ? 'Oops, that receipt was tricky to read. Try scanning it again?'
    : "Let's scan your first receipt!";

  return (
    <DashboardLayout
      content={
        <div className="grid gap-4">
          <Header
            title="Scan a receipt"
            description="Point, tap, and I'll read the rest."
          />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
            <div className="grid gap-4">
              <Viewfinder
                camera={camera}
                reading={reading > 0}
                videoRef={videoRef}
                onRetry={startCamera}
                onPick={() => fileInputRef.current?.click()}
              />
              <UsageMeter from="scan" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={onPick}
                className="sr-only"
                aria-label="Choose receipt photos"
              />
              {camera === 'live' ? (
                <Button size="lg" onClick={capture} className="w-full">
                  <Camera aria-hidden />
                  Scan a receipt
                </Button>
              ) : camera === 'unsupported' ? (
                <Button size="lg" asChild className="w-full">
                  <label className="cursor-pointer">
                    <Camera aria-hidden />
                    Scan a receipt
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={onPick}
                      className="sr-only"
                    />
                  </label>
                </Button>
              ) : null}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus aria-hidden />
                Choose from photos
              </Button>
            </div>

            <div className="grid min-w-0 gap-4">
              <Card className="items-center gap-3 text-center sm:flex-row sm:text-left" aria-live="polite">
                <Pip mood={pipMood} size={96} />
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="type-h3">{headline}</h2>
                  {limitHit && (
                    <>
                      <p className="text-sm text-ink-muted">
                        {scanLimit?.used !== undefined &&
                        scanLimit.limit !== undefined
                          ? `${scanLimit.used} of ${scanLimit.limit} used.${
                              resetDate ? ` Resets ${resetDate}.` : ''
                            } `
                          : resetDate
                          ? `Your scans reset ${resetDate}. `
                          : 'Your free plan has a monthly scan limit. '}
                        {blockedCount === 1
                          ? 'Your receipt is'
                          : `Your ${blockedCount} receipts are`}{' '}
                        on hold. Leaving or reloading this page will clear{' '}
                        {blockedCount === 1 ? 'it' : 'them'}.
                      </p>
                      {tier === 'pro' ? (
                        <Button size="sm" onClick={readHeld}>
                          Read my receipts
                        </Button>
                      ) : (
                        <Button asChild size="sm">
                          <Link
                            to={{ pathname: '/membership', search: 'c=scan' }}
                            target="_blank"
                          >
                            Upgrade to Pro
                          </Link>
                        </Button>
                      )}
                    </>
                  )}
                  {reading > 0 && (
                    <div
                      role="progressbar"
                      aria-label="Reading receipts"
                      className="h-3.5 overflow-hidden rounded-full border-[1.5px] border-outline bg-surface-200"
                    >
                      <div
                        className="progress-stripes h-full rounded-full transition-[width] duration-[420ms]"
                        style={{
                          width: `${Math.max(
                            12,
                            (finished.length / items.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                  {celebrate && (
                    <Button asChild size="sm">
                      <Link
                        to={
                          doneCount === 1 && items.length === 1 && items[0].receiptId
                            ? `/dashboard/receipts/${items[0].receiptId}`
                            : '/dashboard/receipts'
                        }
                      >
                        Take a look
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  'hidden rounded-lg border-[2.5px] border-dashed border-outline p-5 text-center transition-[background-color,transform] duration-[220ms] ease-bounce md:block',
                  dragOver ? 'scale-[1.01] bg-blob-sage' : 'bg-surface-100'
                )}
              >
                <p className="font-bold">Drop receipts here</p>
                <p className="text-sm text-ink-muted">
                  or use Choose from photos
                </p>
              </div>

              {items.length > 0 && (
                <section aria-label="This batch">
                  <h2 className="type-h3 mb-3">This batch</h2>
                  <ul className="flex gap-3 overflow-x-auto pb-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="w-24 shrink-0 text-center animate-success-pop"
                      >
                        <div className="relative mb-1.5 grid h-28 place-items-center overflow-hidden rounded-sm border-2 border-outline bg-[#fffdf8]">
                          <img
                            src={item.url}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <TrayPill item={item} />
                        {item.status === 'failed' && (
                          <button
                            type="button"
                            onClick={() => read(item)}
                            className="mt-1 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-bold underline underline-offset-4"
                          >
                            <RotateCcw aria-hidden className="size-3.5" />
                            Try again
                          </button>
                        )}
                        {item.status === 'blocked' && (
                          <p className="mt-1 text-xs text-ink-muted">
                            Waiting for Pro
                          </p>
                        )}
                        {item.status === 'review' && (
                          <p className="mt-1 text-xs text-rise-ink">
                            Can you double-check this one?
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-label="Tips">
                <h2 className="type-h3 mb-2">Tips</h2>
                <ul className="grid gap-2 text-sm">
                  {TIPS.map((tip, i) => (
                    <li key={tip} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-blob-butter text-xs font-bold text-ink"
                      >
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      }
    />
  );
}

function TrayPill({ item }: { item: BatchItem }) {
  switch (item.status) {
    case 'reading':
      return <StatusIndicator status="loading">Reading</StatusIndicator>;
    case 'done':
      return <StatusIndicator status="success">Done</StatusIndicator>;
    case 'review':
      return <StatusIndicator status="warning">Take a look</StatusIndicator>;
    case 'failed':
      return <StatusIndicator status="destructive">Oops</StatusIndicator>;
    case 'blocked':
      return <StatusIndicator status="pending">Saved</StatusIndicator>;
  }
}

interface ViewfinderProps {
  camera: CameraState;
  reading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onRetry: () => void;
  onPick: () => void;
}

function Viewfinder({ camera, reading, videoRef, onRetry, onPick }: ViewfinderProps) {
  const blocked = camera === 'denied' || camera === 'unsupported';
  return (
    <div className="relative mx-auto grid aspect-[3/4] w-full max-w-md place-items-center overflow-hidden rounded-xl bg-[#2b1d24]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Camera preview"
        className={cn(
          'absolute inset-0 size-full object-cover',
          camera !== 'live' && 'hidden'
        )}
      />
      {camera === 'starting' && (
        <p className="relative text-sm font-bold text-[#fff7ec]">
          Waking up the camera…
        </p>
      )}
      {blocked && (
        <div className="relative grid max-w-[28ch] justify-items-center gap-3 p-6 text-center text-[#fff7ec]">
          <CameraOff aria-hidden className="size-9" />
          <h2 className="font-display text-xl font-semibold">
            {camera === 'denied'
              ? "I can't use the camera yet"
              : "This browser can't open the camera"}
          </h2>
          <p className="text-sm">
            {camera === 'denied'
              ? 'Allow camera access in your browser settings, then try again. You can always choose a photo instead.'
              : 'No problem, you can choose a photo instead.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {camera === 'denied' && (
              <Button size="sm" onClick={onRetry}>
                <Check aria-hidden />
                Try again
              </Button>
            )}
            <Button size="sm" variant="secondary" onClick={onPick}>
              <ImagePlus aria-hidden />
              Choose from photos
            </Button>
          </div>
        </div>
      )}
      {!blocked && (
        <>
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-[6%] size-[88%]"
            fill="none"
            stroke="#ffe28a"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          >
            <path d="M0 14V4a4 4 0 0 1 4-4h10M86 0h10a4 4 0 0 1 4 4v10M100 86v10a4 4 0 0 1-4 4H86M14 100H4a4 4 0 0 1-4-4V86" />
          </svg>
          {reading && (
            <div className="absolute right-[12%] left-[12%] h-1 animate-beam rounded-sm bg-[#ffe28a] shadow-[0_0_18px_6px_rgba(255,226,138,0.5)]" />
          )}
          <p className="absolute right-3 bottom-3 left-3 rounded-full bg-[#2b1d24]/80 px-3.5 py-2 text-center text-[13px] leading-[18px] font-bold text-[#fff7ec]">
            Lay it flat and make sure the total is visible
          </p>
        </>
      )}
    </div>
  );
}
