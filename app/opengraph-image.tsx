import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/metadata";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// the share card: favicon on the left, name on the right, on the site
// background. og-favicon.png is the 476px original of app/icon.png (that one
// is downscaled to 64px), so it stays sharp at card size.
const ICON_SIZE = 300;
const FONT_FAMILY = "Bricolage Grotesque";
const FONT_WEIGHT = 700;

// the site's display font (app/layout.tsx), subset to just the name. satori
// needs ttf/otf, which google fonts serves when no browser user agent is sent.
// if the fetch fails the card still renders in next/og's default font.
async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${FONT_FAMILY.replace(/ /g, "+")}:wght@${FONT_WEIGHT}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [icon, font] = await Promise.all([
    readFile(join(process.cwd(), "app", "og-favicon.png")),
    loadDisplayFont(SITE_NAME),
  ]);
  const src = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "#0a0a0a",
        }}
      >
        <img src={src} width={ICON_SIZE} height={ICON_SIZE} alt="" />
        <div
          style={{
            display: "flex",
            fontFamily: font ? FONT_FAMILY : undefined,
            fontWeight: FONT_WEIGHT,
            fontSize: 128,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            // the site's --fg
            color: "#f3f3f0",
            // optical centring: lowercase x-height sits below the em-box centre
            paddingBottom: 12,
          }}
        >
          {SITE_NAME}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: FONT_FAMILY, data: font, weight: FONT_WEIGHT, style: "normal" }] : undefined,
    },
  );
}
