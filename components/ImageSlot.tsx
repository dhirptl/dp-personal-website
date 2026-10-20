"use client";

import Image from "next/image";
import { useState, type CSSProperties, type SyntheticEvent } from "react";
import styles from "./ImageSlot.module.css";

type ImageSlotProps = {
  src?: string;
  alt: string;
  placeholder: string;
  shape?: "rect" | "rounded" | "circle";
  radius?: number;
  zoom?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** grayscale until hover (default, used on /about). false = always full colour. */
  grayscale?: boolean;
  /**
   * "cover" (default) always fills the slot.
   * "contain" shows the whole image, centred over a blurred, darkened copy of
   * itself instead of cropping it (portrait photos in a wide slot). Prefer
   * deciding cover vs contain on the server (see lib/image-size.ts) so the
   * image can paint before hydration.
   * "auto" decides in the browser: cover for landscape sources, contain when
   * the source is much narrower than the slot. It fades in after measuring,
   * except for priority images, which never wait on JS.
   */
  fit?: "cover" | "contain" | "auto";
};

export function ImageSlot({
  src,
  alt,
  placeholder,
  shape = "rounded",
  radius = 12,
  zoom = 1,
  className,
  sizes = "100vw",
  priority,
  grayscale = true,
  fit = "cover",
}: ImageSlotProps) {
  const borderRadius = shape === "circle" ? "50%" : shape === "rect" ? 0 : radius;
  // src the orientation was measured for - keyed so a new src re-measures
  const [measured, setMeasured] = useState<{ src: string; contain: boolean } | null>(null);
  const auto = fit === "auto";
  const m = measured && measured.src === src ? measured : null;
  const contain = fit === "contain" || (auto && !!m?.contain);
  // a priority (lcp) image is shown straight away; it may switch to contain
  // after measuring, which beats holding the page's largest paint on hydration
  const hideUntilMeasured = auto && !priority;

  const onLoad = auto
    ? (e: SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const slot = img.parentElement;
        if (!src || !img.naturalWidth || !img.naturalHeight || !slot) return;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const slotRatio = slot.clientWidth / Math.max(1, slot.clientHeight);
        // cropping away more than ~35% of the image's width reads as a bad crop
        setMeasured({ src, contain: imgRatio < slotRatio * 0.65 });
      }
    : undefined;

  const imgClass = [
    styles.img,
    !grayscale && styles.color,
    hideUntilMeasured && styles.auto,
    hideUntilMeasured && m && styles.ready,
    contain && styles.contain,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[styles.slot, className].filter(Boolean).join(" ")}
      style={{ borderRadius, "--zoom": zoom } as CSSProperties}
    >
      {src ? (
        <>
          {contain && (
            <Image
              src={src}
              alt=""
              aria-hidden="true"
              fill
              sizes={sizes}
              className={[styles.backdrop, !grayscale && styles.color].filter(Boolean).join(" ")}
            />
          )}
          {/* Alt text should describe the actual photo subject/context, not UI captions;
              strip decorative emoji even if present in visible labels (e.g. "lily 🐶" → "lily") */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={imgClass}
            priority={priority}
            // next 16's priority only preloads + disables lazy; ask for high too
            fetchPriority={priority ? "high" : undefined}
            onLoad={onLoad}
          />
        </>
      ) : (
        <div className={styles.placeholder}>
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}
