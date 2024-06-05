import { useDeviceWidth } from '@/hooks/use-device-width';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import Viewer from 'react-viewer';
import { Card, CardContent } from './ui/card';

interface DocViewerCardProps {
  objectKey?: string;
  className?: string;
}

export function DocViewerCard({
  objectKey,
  className,
  ...props
}: DocViewerCardProps) {
  const isMobile = useDeviceWidth();

  const ref = useRef<HTMLDivElement>(null);
  const bucketUrl = import.meta.env.VITE_S3_BUCKET_URL;
  const src = `${bucketUrl}/${objectKey}`;
  return (
    <div className="hidden sm:block">
      <Card className={cn('sticky top-4', className)}>
        <CardContent className="pt-6">
          <div className="overflow-hidden rounded-md">
            <div ref={ref} className="h-[590px]">
              <Viewer
                zoomSpeed={0.2}
                defaultScale={1.5}
                minScale={1.5}
                visible={!isMobile}
                images={[{ src, alt: '', downloadUrl: src }]}
                noClose
                noNavbar
                downloadable
                noResetZoomAfterChange
                container={ref.current || undefined}
                scalable={false}
                changeable={false}
                showTotal={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
