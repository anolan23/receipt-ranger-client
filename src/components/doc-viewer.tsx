import { useDeviceWidth } from '@/hooks/use-device-width';
import { useRef } from 'react';
import Viewer from 'react-viewer';

interface DocViewerProps {
  objectKey?: string;
}

export function DocViewer({ objectKey, ...props }: DocViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceWidth();
  const BUCKET_DOMAIN = 'https://receipt-ranger.s3.amazonaws.com';
  const src = `${BUCKET_DOMAIN}/${objectKey}`;
  return (
    <div ref={ref} className="h-[590px]">
      <Viewer
        zoomSpeed={0.2}
        defaultScale={1.5}
        minScale={1.5}
        // defaultSize={{ width: 100, height: 400 }}
        visible={true}
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
  );
}
