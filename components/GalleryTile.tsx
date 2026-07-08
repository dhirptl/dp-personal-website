"use client";

import { useState } from "react";
import type { GalleryItem } from "@/lib/site-data";
import { ImageSlot } from "@/components/ImageSlot";
import styles from "./GalleryTile.module.css";

export function GalleryTile({ item }: { item: GalleryItem }) {
  const photos = item.photos ?? null;
  const [idx, setIdx] = useState(0);

  if (!photos) {
    return (
      <div className={styles.tile}>
        {!item.noImage && (
          <ImageSlot alt={item.label} placeholder={item.label} shape="rect" zoom={1.04} />
        )}
        <span className={styles.cap}>{item.label}</span>
      </div>
    );
  }

  const next = () => setIdx((i) => (i + 1) % photos.length);
  const cur = photos[idx];
  const captioned = photos.some((p) => p.location);

  return (
    <div
      className={[styles.tile, !captioned ? styles.nocap : ""].filter(Boolean).join(" ")}
      onClick={captioned ? undefined : next}
      role={captioned ? undefined : "button"}
      aria-label={captioned ? undefined : "next photo"}
    >
      {photos.map((p, i) => (
        <div key={p.id} className={styles.photo} style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}>
          <ImageSlot
            alt={item.label + (p.location ? ` · ${p.location}` : "")}
            placeholder={item.label + (p.location ? ` · ${p.location}` : "")}
            shape="rect"
            zoom={1.04}
          />
        </div>
      ))}
      <span className={styles.cap}>{item.label}</span>
      <div className={styles.dots}>
        {photos.map((p, i) => (
          <span key={p.id} className={i === idx ? styles.on : ""}></span>
        ))}
      </div>
      {captioned && (
        <button className={`${styles.locpill} eng-btn`} onClick={next} aria-label="next photo">
          <span>{cur.location}</span>
          <span className={styles.arr}>→</span>
        </button>
      )}
    </div>
  );
}
