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
   * "auto" fills the slot for landscape sources, but when the source is much
   * narrower than the slot (portrait photos) it shows the whole image, centred
   * over a blurred, darkened copy of itself instead of cropping it.
   */
  fit?: "cover" | "auto";
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
  const contain = auto && !!m?.contain;

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
    auto && styles.auto,
    auto && m && styles.ready,
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
