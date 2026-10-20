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
 * How long after "load-complete" the canvas is revealed. The scene's Start
 * events play a fixed timeline from load: a ~3s camera pull-back from a close-up
 * of the head, then the arm idle. That timeline is deterministic (same pose at
 * the same offset on every load) and the robot is near-still from ~6.0s to
 * ~7.0s, so the canvas fades in at 6.2s, the poster fades out by 7.0s, and the
 * poster below is the frame at 6.4s. Change the scene or this value and the
 * poster has to be re-captured at the new offset.
 */
const POSE_SYNC_MS = 6200;

/**
 * Still of the scene captured from the live viewer on desktop (942x1076 =
 * 2x the 471x538 hero box at the 1120px container) 6.4s after "load-complete"
 * (see POSE_SYNC_MS), transparent background so the card's spotlight shows
 * through it exactly like it does through the canvas.
 */
const POSTER_SRC = "/images/hero-robot-poster-v2.webp";

/**
 * Hero robot. A static poster is the default render (and all phones / low-end
 * devices ever get). On capable devices the viewer chunk, scene file and wasm
 * are fetched only after the page has loaded and gone idle, and the canvas
 * fades in over the poster POSE_SYNC_MS after the viewer dispatches
 * "load-complete" (it never dispatches a plain "load"), when the live pose
 * matches the poster's.
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

    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    const fallback = setTimeout(() => setLoaded(true), REVEAL_FALLBACK_MS);
    const onLoad = () => {
      // keep the poster up through the scene's intro and swap at the pose it
      // was captured at, so the arms and camera don't jump
      clearTimeout(fallback);
      revealTimer = setTimeout(() => setLoaded(true), POSE_SYNC_MS);
    };
    el.addEventListener("load-complete", onLoad);
    // The viewer sets `_loaded` right before dispatching "load-complete", so
    // this covers a scene that finished before the listener was attached (its
    // timeline offset is unknown then, so just reveal).
    if (el._loaded) setLoaded(true);

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
      clearTimeout(fallback);
      clearTimeout(revealTimer);
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
