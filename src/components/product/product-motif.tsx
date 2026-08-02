import { cn } from "@/lib/utils";

/**
 * Stand-in artwork for products that don't have photography yet.
 *
 * Rather than a grey box, each product gets a deterministic ornament drawn
 * from its slug — so the grid reads as a designed catalogue and every card
 * stays visually stable between renders. Once `product.image` is populated the
 * real photo takes over (see `ProductImage`).
 */

const MOTIFS = ["bangles", "bloom", "jhumka", "lattice"] as const;
type Motif = (typeof MOTIFS)[number];

/**
 * All five pairs stay inside the brand's warm arc — rose, gold, terracotta,
 * plum, clay. Cool hues read as a different shop entirely when a grid of these
 * sits next to the rose primary.
 */
const PALETTES = [
  { from: "oklch(0.94 0.04 20)", to: "oklch(0.87 0.08 25)", ink: "oklch(0.44 0.13 8)" },
  { from: "oklch(0.95 0.04 82)", to: "oklch(0.88 0.09 72)", ink: "oklch(0.46 0.10 62)" },
  { from: "oklch(0.94 0.03 350)", to: "oklch(0.87 0.07 340)", ink: "oklch(0.42 0.12 348)" },
  { from: "oklch(0.94 0.04 45)", to: "oklch(0.87 0.08 38)", ink: "oklch(0.45 0.11 35)" },
  { from: "oklch(0.95 0.02 15)", to: "oklch(0.89 0.05 10)", ink: "oklch(0.40 0.10 5)" },
];

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function Bangles({ ink }: { ink: string }) {
  return (
    <g stroke={ink} fill="none" strokeWidth={2.5} opacity={0.75}>
      {[52, 40, 28].map((radius, index) => (
        <circle
          key={radius}
          cx={100}
          cy={100}
          r={radius}
          strokeDasharray={index === 1 ? "6 5" : undefined}
        />
      ))}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <circle
            key={index}
            cx={100 + Math.cos(angle) * 66}
            cy={100 + Math.sin(angle) * 66}
            r={3}
            fill={ink}
            stroke="none"
          />
        );
      })}
    </g>
  );
}

function Bloom({ ink }: { ink: string }) {
  return (
    <g stroke={ink} strokeWidth={2.5} opacity={0.75}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ellipse
          key={index}
          cx={100}
          cy={68}
          rx={13}
          ry={32}
          fill="none"
          transform={`rotate(${index * 45} 100 100)`}
        />
      ))}
      <circle cx={100} cy={100} r={9} fill={ink} stroke="none" />
    </g>
  );
}

function Jhumka({ ink }: { ink: string }) {
  return (
    <g stroke={ink} strokeWidth={2.5} fill="none" opacity={0.75}>
      <path d="M100 38a22 22 0 0 1 22 22" />
      <circle cx={100} cy={70} r={7} fill={ink} stroke="none" />
      <path d="M56 128a44 44 0 0 1 88 0z" />
      <path d="M70 128a30 30 0 0 1 60 0" />
      {Array.from({ length: 7 }).map((_, index) => (
        <circle
          key={index}
          cx={58 + index * 14}
          cy={140 + Math.sin(index) * 3}
          r={4}
          fill={ink}
          stroke="none"
        />
      ))}
    </g>
  );
}

function Lattice({ ink }: { ink: string }) {
  return (
    <g stroke={ink} strokeWidth={2} fill="none" opacity={0.7}>
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, column) => (
          <rect
            key={`${row}-${column}`}
            x={38 + column * 26}
            y={38 + row * 26}
            width={18}
            height={18}
            rx={4}
            transform={`rotate(45 ${47 + column * 26} ${47 + row * 26})`}
          />
        )),
      )}
    </g>
  );
}

const RENDERERS: Record<Motif, (props: { ink: string }) => React.ReactElement> = {
  bangles: Bangles,
  bloom: Bloom,
  jhumka: Jhumka,
  lattice: Lattice,
};

export function ProductMotif({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const digest = hash(seed);
  const palette = PALETTES[digest % PALETTES.length];
  // Unsigned shift: `>>` would go negative for hashes above 2^31 and index off
  // the end of the array.
  const motif = MOTIFS[(digest >>> 3) % MOTIFS.length];
  const Shape = RENDERERS[motif];
  const gradientId = `motif-${digest.toString(36)}`;

  return (
    <svg
      viewBox="0 0 200 200"
      // Fill the container rather than letterbox, so non-square frames work.
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      className={cn("size-full", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
      </defs>
      <rect width={200} height={200} fill={`url(#${gradientId})`} />
      <Shape ink={palette.ink} />
    </svg>
  );
}
