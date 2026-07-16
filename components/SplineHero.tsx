"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Defers the heavy Spline viewer until the hero is near the viewport and the
 * browser is idle, so first paint / LCP aren’t blocked by the 3D runtime.
 */
export function SplineHero() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [boot, setBoot] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      import("@splinetool/viewer")
        .then(() => {
          if (!cancelled) setBoot(true);
        })
        .catch(() => {
          /* keep poster/loader if the viewer fails to load */
        });
    };

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 1800 });
      } else {
        timeoutId = setTimeout(start, 200);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        schedule();
      },
      { rootMargin: "120px" },
    );

    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!boot) return;
    const el = hostRef.current?.querySelector("spline-viewer");
    if (!el) return;

    const onLoad = () => setLoaded(true);
    el.addEventListener("load", onLoad);
    const t = setTimeout(() => setLoaded(true), 6000);
    return () => {
      el.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, [boot]);

  return (
    <div
      className={`${styles.right}${loaded ? ` ${styles.on}` : ""}`}
      ref={hostRef}
      aria-busy={!loaded}
    >
      <div className={styles.poster} aria-hidden="true" />
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <span className={styles.loaderLabel}>{boot ? "loading scene…" : "preparing…"}</span>
      </div>
      {boot ? <spline-viewer url={SPLINE_SCENE_URL}></spline-viewer> : null}
    </div>
  );
}
