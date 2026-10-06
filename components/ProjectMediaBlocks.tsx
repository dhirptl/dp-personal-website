"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, SyntheticEvent } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/lib/project-media";
import { Reveal } from "@/components/Reveal";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "./ProjectMediaBlocks.module.css";

const SWIPE_MIN_PX = 50;

/* Is the point inside the pixels an object-fit: contain <img> actually paints? */
function hitsContainedImage(img: HTMLImageElement, x: number, y: number): boolean {
  const r = img.getBoundingClientRect();
  if (!img.naturalWidth || !img.naturalHeight) return true;
  const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const left = r.left + (r.width - w) / 2;
  const top = r.top + (r.height - h) / 2;
  return x >= left && x <= left + w && y >= top && y <= top + h;
}

/* Gallery (with a native <dialog> lightbox), self-hosted video, and an
   off-site video link for a project case study. Renders nothing when the
   project has no media entries. */
export function ProjectMediaBlocks({ media, name }: { media: ProjectMedia; name: string }) {
  const gallery = media.gallery ?? [];
  const [open, setOpen] = useState<number | null>(null);
  // src of the last lightbox image that finished loading (drives the loading state)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  // gallery srcs whose natural size is portrait (get a blurred backdrop tile)
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});
  const [videoPortrait, setVideoPortrait] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const isOpen = open !== null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      closeRef.current?.focus();
    }
    if (open === null && d.open) d.close();
  }, [open]);

  // lock background scroll while the lightbox is open. Only <html> is touched
  // (locking body too breaks the sticky header); the previous value is restored.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [isOpen]);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length)),
    [gallery.length],
  );

  const onTileLoad = (src: string) => (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const isPortrait = h > w;
    setPortrait((m) => (m[src] === isPortrait ? m : { ...m, [src]: isPortrait }));
  };

  const onSwipeStart = (e: PointerEvent<HTMLDivElement>) => {
    swipedRef.current = false;
    if (e.pointerType === "mouse" || gallery.length < 2) return;
    swipeRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };

  const onSwipeEnd = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swipedRef.current = true;
    step(dx < 0 ? 1 : -1);
  };

  // clicks on the letterboxed area around the image close; clicks on the image don't
  const onImgAreaClick = (e: MouseEvent<HTMLDivElement>) => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    const img = e.currentTarget.querySelector("img");
    if (img && !hitsContainedImage(img, e.clientX, e.clientY)) setOpen(null);
  };

  if (!gallery.length && !media.video && !media.externalVideo) return null;

  const cur = open !== null ? gallery[open] : null;
  const curLoaded = !!cur && loadedSrc === cur.src;

  return (
    <>
      {(media.video || media.externalVideo) && (
        <Reveal className={styles.sec}>
          <h2 className={styles.seclabel}>video</h2>
          {media.video && (
            <figure className={styles.figure}>
              <video
                className={`${styles.video} ${videoPortrait ? styles.videoPortrait : ""}`}
                src={media.video.src}
                poster={media.video.poster}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  setVideoPortrait(v.videoHeight > v.videoWidth);
                }}
              >
                your browser can&apos;t play this video.
              </video>
              {media.video.caption && (
                <figcaption className={styles.cap}>{media.video.caption}</figcaption>
              )}
            </figure>
          )}
          {media.externalVideo && (
            <WithLiquidMetal
              as="a"
              className={`eng-btn lg ${styles.extBtn}`}
              href={media.externalVideo.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {media.externalVideo.label}
              <span className="eng-arrow" aria-hidden="true">
                ↗
              </span>
            </WithLiquidMetal>
          )}
        </Reveal>
      )}

      {gallery.length > 0 && (
        <Reveal className={styles.sec}>
          <h2 className={styles.seclabel}>gallery</h2>
          <ul className={styles.grid}>
            {gallery.map((g, i) => {
              const tileSizes = "(max-width: 560px) 92vw, (max-width: 820px) 46vw, 380px";
              return (
                <li key={g.src}>
                  <figure className={styles.figure}>
                    <button
                      type="button"
                      className={styles.tile}
                      onClick={() => setOpen(i)}
                      aria-label={`enlarge image: ${g.alt ?? g.caption}`}
                    >
                      {portrait[g.src] && (
                        <Image
                          src={g.src}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes={tileSizes}
                          className={styles.tileBackdrop}
                        />
                      )}
                      <Image
                        src={g.src}
                        alt={g.alt ?? g.caption}
                        fill
                        sizes={tileSizes}
                        className={styles.tileImg}
                        onLoad={onTileLoad(g.src)}
                      />
                    </button>
                    <figcaption className={styles.cap}>{g.caption}</figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}

      {gallery.length > 0 && (
        <dialog
          ref={dialogRef}
          className={styles.lightbox}
          aria-label={`${name} gallery`}
          onClose={() => setOpen(null)}
          onClick={(e) => {
            // click on the backdrop (the dialog element itself) closes
            if (e.target === e.currentTarget) setOpen(null);
          }}
          onKeyDown={(e) => {
            if (gallery.length < 2) return;
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          {cur && (
            <div className={styles.lbInner}>
              <div
                className={styles.lbImgWrap}
                onClick={onImgAreaClick}
                onPointerDown={onSwipeStart}
                onPointerUp={onSwipeEnd}
                onPointerCancel={() => {
                  swipeRef.current = null;
                }}
                aria-busy={!curLoaded}
              >
                {!curLoaded && (
                  <span className={styles.lbLoading} aria-hidden="true">
                    loading…
                  </span>
                )}
                <Image
                  key={cur.src}
                  src={cur.src}
                  alt={cur.alt ?? cur.caption}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className={`${styles.lbImg} ${curLoaded ? styles.lbImgLoaded : ""}`}
                  onLoad={() => setLoadedSrc(cur.src)}
                />
              </div>
              <div className={styles.lbBar}>
                <p className={styles.lbCap}>
                  {cur.caption}
                  <span className={styles.lbCount}>
                    {" "}
                    {open! + 1}/{gallery.length}
                  </span>
                </p>
                <div className={styles.lbCtrls}>
                  {gallery.length > 1 && (
                    <>
                      <button type="button" className="eng-btn" onClick={() => step(-1)} aria-label="previous image">
                        ←
                      </button>
                      <button type="button" className="eng-btn" onClick={() => step(1)} aria-label="next image">
                        →
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="eng-btn"
                    ref={closeRef}
                    onClick={() => setOpen(null)}
                    aria-label="close"
                  >
                    close
                    <span className={styles.escHint} aria-hidden="true">
                      [esc]
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </dialog>
      )}
    </>
  );
}
