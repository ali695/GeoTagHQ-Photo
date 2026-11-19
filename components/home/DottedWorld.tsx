// Dotted world map, rendered as static SVG on the server (idea from Magic UI's MIT "dotted-map",
// re-implemented without the svg-dotted-map dependency). Land is a coarse hand-made mask:
// one row per 5° latitude band, each a list of [westLon, eastLon] land intervals.
const BANDS: Array<[number, Array<[number, number]>]> = [
  [82.5, [[-90, -65], [-60, -20]]],
  [77.5, [[-120, -70], [-70, -15], [10, 25], [95, 110]]],
  [72.5, [[-160, -80], [-55, -20], [20, 30], [55, 60], [70, 140]]],
  [67.5, [[-165, -95], [-80, -62], [-55, -25], [-24, -14], [13, 30], [30, 180]]],
  [62.5, [[-165, -95], [-78, -62], [-50, -42], [5, 30], [30, 180]]],
  [57.5, [[-160, -92], [-80, -60], [-6, -2], [6, 20], [22, 162]]],
  [52.5, [[-130, -80], [-78, -56], [-10, 2], [4, 140], [142, 143]]],
  [47.5, [[-125, -65], [-4, 140], [141, 145]]],
  [42.5, [[-124, -70], [-9, 28], [41, 132], [140, 145]]],
  [37.5, [[-122, -76], [-9, -1], [13, 27], [26, 128], [132, 141]]],
  [32.5, [[-117, -80], [-9, 32], [34, 122], [130, 135]]],
  [27.5, [[-114, -97], [-82, -80], [-13, 34], [36, 120]]],
  [22.5, [[-106, -97], [-84, -75], [-16, 37], [39, 59], [68, 90], [92, 117], [120, 121]]],
  [17.5, [[-103, -88], [-16, 40], [42, 55], [73, 84], [95, 108], [120, 122]]],
  [12.5, [[-88, -83], [-73, -62], [-17, 51], [75, 80], [98, 109], [122, 125]]],
  [7.5, [[-82, -77], [-77, -55], [-13, 48], [77, 81], [99, 102], [124, 126]]],
  [2.5, [[-80, -50], [9, 42], [98, 104], [109, 118], [120, 125], [127, 129]]],
  [-2.5, [[-80, -40], [9, 41], [100, 106], [110, 117], [119, 123], [132, 150]]],
  [-7.5, [[-79, -35], [12, 40], [106, 115], [137, 148]]],
  [-12.5, [[-77, -38], [13, 41], [48, 50], [130, 137], [142, 143]]],
  [-17.5, [[-71, -39], [12, 38], [44, 50], [122, 146]]],
  [-22.5, [[-70, -41], [14, 36], [43, 48], [114, 150]]],
  [-27.5, [[-71, -48], [15, 32], [114, 153]]],
  [-32.5, [[-71, -52], [18, 28], [116, 124], [135, 152]]],
  [-37.5, [[-73, -57], [140, 150], [174, 178]]],
  [-42.5, [[-74, -63], [145, 148], [171, 174]]],
  [-47.5, [[-75, -66], [167, 170]]],
  [-52.5, [[-74, -68]]],
];

const TOP = 85; // latitude at y = 0
const STEP = 2.5; // degrees between dots

const isLand = (lat: number, lon: number) => {
  const band = BANDS.find(([c]) => Math.abs(c - lat) <= 2.5);
  return !!band && band[1].some(([w, e]) => lon >= w && lon <= e);
};

const DOTS: Array<[number, number]> = [];
for (let row = 0, lat = TOP - STEP / 2; lat > -57; lat -= STEP, row++) {
  const offset = row % 2 ? STEP / 2 : 0; // staggered rows, like a halftone
  for (let lon = -180 + STEP / 2 + offset; lon < 180; lon += STEP) {
    if (isLand(lat, lon)) DOTS.push([lon + 180, TOP - lat]);
  }
}

/** dx/dy move the label (map units) where pins sit close together, e.g. western Europe. */
export type Pin = { lat: number; lng: number; label: string; href?: string; dx?: number; dy?: number };

const project = (p: { lat: number; lng: number }) => ({ x: p.lng + 180, y: TOP - p.lat });

/** Curved route between two pins (quadratic arc lifted above the straight line). */
function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const my = Math.min(a.y, b.y) - dist * 0.28;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
}

export default function DottedWorld({ pins = [], routes = [], className = '' }: { pins?: Pin[]; routes?: Array<[string, string]>; className?: string }) {
  const byLabel = new Map(pins.map((p) => [p.label, project(p)]));
  return (
    <svg viewBox="0 0 360 142" className={className} role="img" aria-label="World map with PinPixl language markets">
      <g fill="currentColor">
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.62} />
        ))}
      </g>
      <g fill="none" stroke="var(--color-pin)" strokeWidth={0.55} strokeLinecap="round" opacity={0.75}>
        {routes.map(([from, to]) => {
          const a = byLabel.get(from);
          const b = byLabel.get(to);
          return a && b ? <path key={`${from}-${to}`} d={arc(a, b)} className="anim-march on-reveal" /> : null;
        })}
      </g>
      {pins.map((p, i) => {
        const { x, y } = project(p);
        const pin = (
          <g key={p.label} className="anim-pop on-reveal" style={{ ['--i' as string]: i }}>
            <circle cx={x} cy={y} r={2.2} fill="var(--color-pin)" opacity={0.22} className="animate-ping-soft" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${(i % 6) * 0.4}s` }} />
            <circle cx={x} cy={y} r={1.5} fill="var(--color-pin)" stroke="var(--color-paper)" strokeWidth={0.5} />
            <text x={x + (p.dx ?? 2.6)} y={y + (p.dy ?? -2.2)} fontSize={3.6} fontFamily="var(--font-mono)" fontWeight={600} fill="var(--color-ink)">
              {p.label}
            </text>
          </g>
        );
        return p.href ? (
          <a key={p.label} href={p.href} aria-label={p.label}>
            {pin}
          </a>
        ) : (
          pin
        );
      })}
    </svg>
  );
}
