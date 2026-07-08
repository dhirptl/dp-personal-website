// Aurora tint pairs — ported from SwirlGallery card palette.
const TINTS: [string, string][] = [
  ["#ffb03a", "#45e8ff"],
  ["#45e8ff", "#2f7bff"],
  ["#ff4d8d", "#b14dff"],
  ["#ffb03a", "#ff7a1f"],
  ["#2f7bff", "#b14dff"],
  ["#45e8ff", "#ff4d8d"],
  ["#b14dff", "#ffb03a"],
  ["#ff7a1f", "#45e8ff"],
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getProjectCardSrc(index: number, slug?: string): string {
  const [t1, t2] = TINTS[index % TINTS.length];
  const seed = slug ? hashSlug(slug) : index * 53;
  const cx = 10 + (seed % 80);
  const cy = 15 + ((seed >> 3) % 65);
  const angle = 25 + (seed % 130);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="72%">
      <stop offset="0%" stop-color="${t1}"/>
      <stop offset="50%" stop-color="${t2}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <linearGradient id="l" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${t2}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${t1}" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <rect width="800" height="1000" fill="url(#l)"/>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
