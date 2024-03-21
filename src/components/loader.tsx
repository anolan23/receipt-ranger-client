interface LoaderProps {
  size?: number;
  borderWidth?: number;
  speedMultiplier?: number;
}

export function Loader({
  size = 24,
  borderWidth = 2,
  speedMultiplier = 1,
  ...props
}: LoaderProps) {
  const SPEED = 1;
  return (
    <div
      style={{
        borderWidth,
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
        animationDuration: `${SPEED / speedMultiplier}s`,
      }}
      className={`w-[50px] h-[50px] border-[5px] border-current border-t-transparent rounded-full animate-spin text-primary`}
    ></div>
  );
}
