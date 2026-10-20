import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Build-time pixel size of an image in public/ (server components only).
 * Reads just the PNG / JPEG / WebP headers so pages can make layout decisions
 * (e.g. cover vs contain) without measuring in the browser. Returns null for
 * anything it can't parse, so callers need a fallback.
 */
export type ImageSize = { width: number; height: number };

export function getPublicImageSize(src: string): ImageSize | null {
  if (!src.startsWith("/")) return null;
  let buf: Buffer;
  try {
    buf = readFileSync(path.join(process.cwd(), "public", src));
  } catch {
    return null;
  }
  return pngSize(buf) ?? jpegSize(buf) ?? webpSize(buf);
}

function pngSize(b: Buffer): ImageSize | null {
  // signature, then the IHDR chunk: width/height as big-endian u32
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegSize(b: Buffer): ImageSize | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let orientation = 1;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker === 0xe1) orientation = exifOrientation(b, i + 4, len - 2) ?? orientation;
    // SOF0-SOF15, minus DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = b.readUInt16BE(i + 5);
      const width = b.readUInt16BE(i + 7);
      // orientations 5-8 are rotated 90deg, which the browser applies on display
      return orientation >= 5 ? { width: height, height: width } : { width, height };
    }
    i += 2 + len;
  }
  return null;
}

/** EXIF orientation tag (0x0112) from an APP1 segment, if present. */
function exifOrientation(b: Buffer, start: number, len: number): number | null {
  if (b.toString("ascii", start, start + 4) !== "Exif") return null;
  const tiff = start + 6;
  const le = b.toString("ascii", tiff, tiff + 2) === "II";
  const u16 = (o: number) => (le ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const u32 = (o: number) => (le ? b.readUInt32LE(o) : b.readUInt32BE(o));
  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > start + len) return null;
  const count = u16(ifd);
  for (let k = 0; k < count; k++) {
    const entry = ifd + 2 + k * 12;
    if (entry + 12 > start + len) return null;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return null;
}

function webpSize(b: Buffer): ImageSize | null {
  if (b.length < 30 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}
