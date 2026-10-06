"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";

import { SPLINE_SCENE_URL } from "@/lib/spline";

/** Safety net only: reveal anyway if the viewer never reports completion. */
const REVEAL_FALLBACK_MS = 15000;

/**
 * Start fetching the viewer chunk as soon as this module evaluates in the
 * browser (before hydration) instead of waiting for an effect. Guarded so the
 * server / static render never touches the custom-element runtime.
 */
const viewerReady: Promise<unknown> | null =
  typeof window !== "undefined" ? import("@splinetool/viewer") : null;

/**
 * Hero robot. The scene sits behind a poster + spinner and is revealed when
 * the viewer dispatches "load-complete" (it never dispatches a plain "load").
 * The scene file and modelling wasm are preloaded from app/page.tsx.
 */
export function SplineHero() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [boot, setBoot] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (viewerReady ?? import("@splinetool/viewer"))
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
      | (HTMLElement & { _loaded?: boolean; unload?: () => void })
      | null
      | undefined;
    if (!el) return;

    const onLoad = () => setLoaded(true);
    el.addEventListener("load-complete", onLoad);
    // The viewer sets `_loaded` right before dispatching "load-complete", so
    // this covers a scene that finished before the listener was attached.
    if (el._loaded) setLoaded(true);
    const t = setTimeout(() => setLoaded(true), REVEAL_FALLBACK_MS);

    // Hide the free-tier "Built with Spline" badge — it sits on the robot
    // and reads as UI chrome on mobile.
    const hideLogo = () => {
      const logo = el.shadowRoot?.querySelector("#logo") as HTMLElement | null;
      if (logo) logo.style.setProperty("display", "none", "important");
    };
    hideLogo();
    el.addEventListener("load-complete", hideLogo);
    const logoPoll = window.setInterval(hideLogo, 400);
    const logoStop = window.setTimeout(() => clearInterval(logoPoll), 10000);

    return () => {
      el.removeEventListener("load-complete", onLoad);
      el.removeEventListener("load-complete", hideLogo);
      clearTimeout(t);
      clearInterval(logoPoll);
      clearTimeout(logoStop);

      // The viewer's disconnectedCallback only drops its IntersectionObserver;
      // its render loop keeps drawing into the detached zero-size canvas and
      // floods the console with WebGL framebuffer errors after client-side
      // navigation. Dispose the scene once the element is really gone. The
      // isConnected check (on the next task, after React has removed the node)
      // keeps StrictMode's simulated unmount from killing the live robot.
      setTimeout(() => {
        if (el.isConnected) return;
        if (el._loaded) {
          el.unload?.();
        } else {
          // still loading: dispose as soon as it finishes instead
          el.addEventListener("load-complete", () => el.unload?.(), {
            once: true,
          });
        }
      }, 0);
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
