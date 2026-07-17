"use client";

import { useState } from "react";
import type { GalleryItem } from "@/lib/site-data";
import { ImageSlot } from "@/components/ImageSlot";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "./GalleryTile.module.css";

export function GalleryTile({ item }: { item: GalleryItem }) {
  const photos = item.photos ?? null;
  const [idx, setIdx] = useState(0);

  if (!photos) {
    return (
      <div className={styles.tile}>
        {!item.noImage && (
          <ImageSlot
            src={item.src}
            alt={item.label}
            placeholder={item.label}
            shape="rect"
            zoom={1.04}
            sizes="(max-width: 760px) 50vw, 33vw"
          />
        )}
        <span className={styles.cap}>{item.label}</span>
      </div>
    );
  }

  const next = (el?: HTMLElement | null) => {
    setIdx((i) => (i + 1) % photos.length);
    // Drop focus so :focus-within doesn't leave the tile permanently colorized
    el?.blur();
  };
  const cur = photos[idx];
  const captioned = photos.some((p) => p.location);
  const gallerySizes = "(max-width: 760px) 50vw, 33vw";

  return (
    <div
      className={[styles.tile, !captioned ? styles.nocap : ""].filter(Boolean).join(" ")}
      onClick={
        captioned
          ? undefined
          : (e) => next(e.currentTarget instanceof HTMLElement ? e.currentTarget : null)
      }
      role={captioned ? undefined : "button"}
      aria-label={captioned ? undefined : "next photo"}
      tabIndex={captioned ? undefined : 0}
      onKeyDown={
        captioned
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                next(e.currentTarget);
              }
            }
      }
    >
      {photos.map((p, i) => (
        <div key={p.id} className={styles.photo} style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}>
          <ImageSlot
            src={p.src}
            alt={item.label + (p.location ? ` - ${p.location}` : "")}
            placeholder={item.label + (p.location ? ` - ${p.location}` : "")}
            shape="rect"
            zoom={1.04}
            sizes={gallerySizes}
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
        <WithLiquidMetal
          as="button"
          className={`${styles.locpill} eng-btn`}
          onClick={(e) => {
            e.stopPropagation();
            next(e.currentTarget);
          }}
          aria-label="next photo"
        >
          <span className={styles.locText}>{cur.location}</span>
          <span className={styles.arr}>→</span>
        </WithLiquidMetal>
      )}
    </div>
  );
}
