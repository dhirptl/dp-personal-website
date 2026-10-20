"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import styles from "@/app/page.module.css";

import { canRunHeavyEffects, whenPageIdle } from "@/lib/device-capability";
import { SPLINE_MODELLING_WASM_URL, SPLINE_SCENE_URL } from "@/lib/spline";

/** Safety net only: reveal anyway if the viewer never reports completion. */
const REVEAL_FALLBACK_MS = 15000;

/**
 * Still of the scene captured from the live viewer on desktop (942x1076 =
 * 2x the 471x538 hero box at the 1120px container), transparent background so
 * the card's spotlight shows through it exactly like it does through the canvas.
 */
const POSTER_SRC = "/images/hero-robot-poster.webp";

/**
 * Hero robot. A static poster is the default render (and all phones / low-end
 * devices ever get). On capable devices the viewer chunk, scene file and wasm
 * are fetched only after the page has loaded and gone idle, and the canvas
 * fades in over the poster once the viewer dispatches "load-complete" (it
 * never dispatches a plain "load").
 */
export function SplineHero() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [boot, setBoot] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // decided here, not during render, so server and client markup match
    if (!canRunHeavyEffects()) return;
    let active = true;
    const cancel = whenPageIdle(() => {
      // start the scene + wasm downloads alongside the viewer chunk; the viewer
      // requests both with a plain cors fetch(), which these preloads match
      preload(SPLINE_SCENE_URL, { as: "fetch", crossOrigin: "anonymous" });
      preload(SPLINE_MODELLING_WASM_URL, { as: "fetch", crossOrigin: "anonymous" });
      import("@splinetool/viewer")
        .then(() => {
          if (active) setBoot(true);
        })
        .catch((err) => {
          console.error("[SplineHero] viewer import failed", err);
        });
    });
    return () => {
      active = false;
      cancel();
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
    // and reads as UI chrome.
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
      aria-busy={boot && !loaded}
    >
      <Image
        className={styles.poster}
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 760px) 50vw, 480px"
      />
      {boot ? <spline-viewer url={SPLINE_SCENE_URL} loading="eager"></spline-viewer> : null}
    </div>
  );
}
