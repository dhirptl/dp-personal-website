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
    // Hero is above the fold; load viewer on mount (module is cached after first visit).
    let active = true;
    import("@splinetool/viewer")
      .then(() => {
        if (active) setBoot(true);
      })
      .catch((err) => {
        console.error("[SplineHero] viewer import failed", err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!boot) return;
    const el = hostRef.current?.querySelector("spline-viewer") as
      | (HTMLElement & { _loaded?: boolean })
      | null
      | undefined;
    if (!el) return;

    const onLoad = () => setLoaded(true);
    el.addEventListener("load", onLoad);
    // Scene may finish before this effect runs (cached import / fast network).
    if (el._loaded) setLoaded(true);
    const t = setTimeout(() => setLoaded(true), 6000);
    return () => {
      el.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, [boot]);

  return (
    <div
      className={styles.right}
      data-loaded={loaded ? "true" : "false"}
      ref={hostRef}
      aria-busy={!loaded}
    >
      <div className={styles.poster} aria-hidden="true" />
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <span className={styles.loaderLabel}>{boot ? "loading scene…" : "preparing…"}</span>
      </div>
      {boot ? (
        <spline-viewer url={SPLINE_SCENE_URL} loading="eager"></spline-viewer>
      ) : null}
    </div>
  );
}
