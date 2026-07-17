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

    // Hide the free-tier "Built with Spline" badge — it sits on the robot
    // and reads as UI chrome on mobile.
    const hideLogo = () => {
      const logo = el.shadowRoot?.querySelector("#logo") as HTMLElement | null;
      if (logo) logo.style.setProperty("display", "none", "important");
    };
    hideLogo();
    el.addEventListener("load", hideLogo);
    const logoPoll = window.setInterval(hideLogo, 400);
    const logoStop = window.setTimeout(() => clearInterval(logoPoll), 10000);

    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("load", hideLogo);
      clearTimeout(t);
      clearInterval(logoPoll);
      clearTimeout(logoStop);
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
        <spline-viewer url={SPLINE_SCENE_URL} loading="lazy"></spline-viewer>
      ) : null}
    </div>
  );
}
