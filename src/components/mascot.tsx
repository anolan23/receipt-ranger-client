import { cn } from '@/lib/utils';

export type PipMood = 'happy' | 'reading' | 'celebrate' | 'oops';

interface PipProps {
  mood?: PipMood;
  /** Rendered width and height in px. Pip is never smaller than 48px. */
  size?: number;
  /** Crop to Pip's head: the logo mark. */
  head?: boolean;
  className?: string;
  title?: string;
}

const INK = '#3a2a27';
const FUR = '#b8a7b0';
const FUR_DARK = '#4a3640';
const CREAM = '#fff4ea';
const HAT = '#ffd45e';
const BAND = '#e8604a';
const SAGE = '#8fd1a8';
const PAPER = '#fffdf8';
const PUPIL = '#2b1d24';

const MOOD_LABEL: Record<PipMood, string> = {
  happy: 'happy',
  reading: 'reading',
  celebrate: 'celebrating',
  oops: 'oops',
};

function Receipt({ transform, className }: { transform: string; className?: string }) {
  return (
    <g className={className}>
      <g transform={transform}>
        <path
          d="M108 100H142V152L137 147.5 131 152 125 147.5 119 152 113 147.5 108 152Z"
          fill={PAPER}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M113 109H137M113 117H134M113 125H137M113 133H127"
          stroke="#a08478"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Eyes({ mood }: { mood: PipMood }) {
  if (mood === 'celebrate') {
    return (
      <path
        d="M53 87 Q62 76 71 87M89 87 Q98 76 107 87"
        fill="none"
        stroke={CREAM}
        strokeWidth="4"
        strokeLinecap="round"
      />
    );
  }
  if (mood === 'oops') {
    return (
      <>
        <circle cx="62" cy="86" r="9" fill="#fff" />
        <circle cx="98" cy="86" r="9" fill="#fff" />
        <circle cx="64" cy="88" r="3.8" fill={PUPIL} />
        <circle cx="96" cy="88" r="3.8" fill={PUPIL} />
        <path
          d="M52 77 L70 72M108 77 L90 72"
          stroke={CREAM}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </>
    );
  }
  const reading = mood === 'reading';
  return (
    <>
      <circle cx="62" cy={reading ? 87 : 86} r="9" fill="#fff" />
      <circle cx="98" cy={reading ? 87 : 86} r="9" fill="#fff" />
      <circle
        cx={reading ? 64 : 63.5}
        cy={reading ? 91 : 86.5}
        r={reading ? 4.2 : 4.4}
        fill={PUPIL}
      />
      <circle
        cx={reading ? 100 : 99.5}
        cy={reading ? 91 : 86.5}
        r={reading ? 4.2 : 4.4}
        fill={PUPIL}
      />
      <circle cx={reading ? 65.5 : 65} cy={reading ? 89.5 : 84.8} r="1.5" fill="#fff" />
      <circle cx={reading ? 101.5 : 101} cy={reading ? 89.5 : 84.8} r="1.5" fill="#fff" />
    </>
  );
}

function Mouth({ mood }: { mood: PipMood }) {
  if (mood === 'celebrate') {
    return (
      <>
        <path
          d="M69 106 Q80 128 91 106Z"
          fill="#7a2b1e"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M74 117 Q80 121 86 117"
          fill="none"
          stroke="#ff9c80"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </>
    );
  }
  const d =
    mood === 'reading'
      ? 'M74 111 Q80 114 86 111'
      : mood === 'oops'
      ? 'M71 112 Q75.5 107 80 111 Q84.5 115 89 110'
      : 'M70 108 Q80 118 90 108';
  return (
    <path d={d} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  );
}

/**
 * Pip the ranger raccoon. Drawn only from the shared 160x160 SVG: 2.5px ink
 * outline, flat fills. Colours are fixed illustration colours, not theme tokens.
 * Show Pip at most once per screen, never over text or charts.
 */
export function Pip({
  mood = 'happy',
  size = 120,
  head = false,
  className,
  title,
}: PipProps) {
  const px = Math.max(48, size);
  const celebrate = mood === 'celebrate';
  return (
    <svg
      className={cn('pip inline-block shrink-0', className)}
      viewBox={head ? '26 8 108 118' : '0 0 160 160'}
      width={px}
      height={px}
      role="img"
      aria-label={title ?? `Pip the ranger raccoon, ${MOOD_LABEL[mood]}`}
    >
      <g className={head ? undefined : 'bob'}>
        {/* tail */}
        <path
          d="M50 140Q20 142 22 112Q24 99 36 104"
          fill="none"
          stroke={INK}
          strokeWidth="19"
          strokeLinecap="round"
        />
        <path
          d="M50 140Q20 142 22 112Q24 99 36 104"
          fill="none"
          stroke={FUR}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M38 134Q30 134 28 126M30 118Q27 112 29 108"
          fill="none"
          stroke={FUR_DARK}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* body + neckerchief */}
        <ellipse cx="80" cy="138" rx="32" ry="22" fill={FUR} stroke={INK} strokeWidth="2.5" />
        <ellipse cx="80" cy="143" rx="19" ry="13" fill={CREAM} />
        <path
          d="M60 122Q80 136 100 122L80 148Z"
          fill={SAGE}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* ears */}
        <circle cx="42" cy="62" r="14" fill={FUR} stroke={INK} strokeWidth="2.5" />
        <circle cx="118" cy="62" r="14" fill={FUR} stroke={INK} strokeWidth="2.5" />
        <circle cx="42" cy="64" r="7" fill="#e8b9b3" />
        <circle cx="118" cy="64" r="7" fill="#e8b9b3" />
        {/* head + mask */}
        <ellipse cx="80" cy="86" rx="47" ry="38" fill={FUR} stroke={INK} strokeWidth="2.5" />
        <path
          d="M35 82Q54 65 80 77Q106 65 125 82Q121 105 98 100Q88 96 80 100Q72 96 62 100Q39 105 35 82Z"
          fill={FUR_DARK}
        />
        <Eyes mood={mood} />
        {/* muzzle */}
        <ellipse cx="80" cy="104" rx="16" ry="11" fill={CREAM} />
        <ellipse cx="80" cy="97.5" rx="5.5" ry="4" fill={INK} />
        <circle cx="47" cy="101" r="5.5" fill="#ff9c80" opacity=".6" />
        <circle cx="113" cy="101" r="5.5" fill="#ff9c80" opacity=".6" />
        <Mouth mood={mood} />
        {/* ranger hat */}
        <ellipse cx="80" cy="54" rx="55" ry="11" fill={HAT} stroke={INK} strokeWidth="2.5" />
        <path
          d="M54 52Q54 20 80 18Q106 20 106 52Z"
          fill={HAT}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M54.5 44Q80 53 105.5 44L106 52Q80 61 54 52Z"
          fill={BAND}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M80 26l2.4 5 5.4.7-4 3.7 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.7 5.4-.7z"
          fill={CREAM}
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* receipt + paws */}
        {celebrate ? (
          <>
            <Receipt transform="rotate(-18 128 100) translate(4 -30)" />
            <circle cx="124" cy="116" r="7" fill={FUR} stroke={INK} strokeWidth="2.5" />
            <circle cx="38" cy="112" r="7" fill={FUR} stroke={INK} strokeWidth="2.5" />
          </>
        ) : (
          <>
            <Receipt
              transform="rotate(10 124 126)"
              className={mood === 'reading' && !head ? 'rcpt' : undefined}
            />
            <circle cx="109" cy="131" r="7" fill={FUR} stroke={INK} strokeWidth="2.5" />
            <circle cx="141" cy="127" r="7" fill={FUR} stroke={INK} strokeWidth="2.5" />
          </>
        )}
      </g>
      {celebrate && !head && (
        <>
          <polygon
            className="tw"
            points="26,29 29,37 37,40 29,43 26,51 23,43 15,40 23,37"
            fill={HAT}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            className="tw tw2"
            points="138,21 140.4,27.6 147,30 140.4,32.4 138,39 135.6,32.4 129,30 135.6,27.6"
            fill={HAT}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            className="tw tw3"
            points="142,89 143.9,94.1 149,96 143.9,97.9 142,103 140.1,97.9 135,96 140.1,94.1"
            fill={HAT}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="82" r="3.5" fill="#ff9c80" />
          <circle cx="148" cy="62" r="3.5" fill="#8ec9ee" />
          <circle cx="30" cy="14" r="3" fill="#c0acf2" />
        </>
      )}
      {mood === 'oops' && !head && (
        <path
          d="M128 58 Q135 68 128 73 Q121 68 128 58Z"
          fill="#8ec9ee"
          stroke={INK}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

/** Pip's head beside the name "Receipt Ranger", set in the display face. */
export function BrandMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        'type-h3 inline-flex items-center gap-2.5 text-[20px] leading-none font-semibold',
        className
      )}
    >
      <Pip head size={size} title="Receipt Ranger" />
      Receipt Ranger
    </span>
  );
}
