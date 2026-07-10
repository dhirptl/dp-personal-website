import Image from "next/image";
import type { CSSProperties } from "react";
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
}: ImageSlotProps) {
  const borderRadius = shape === "circle" ? "50%" : shape === "rect" ? 0 : radius;

  return (
    <div
      className={[styles.slot, className].filter(Boolean).join(" ")}
      style={{ borderRadius, "--zoom": zoom } as CSSProperties}
    >
      {src ? (
        /* Alt text should describe the actual photo subject/context, not UI captions;
           strip decorative emoji even if present in visible labels (e.g. "lily 🐶" → "lily") */
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.img} priority={priority} />
      ) : (
        <div className={styles.placeholder}>
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}
