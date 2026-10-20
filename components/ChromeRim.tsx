"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  LIQUID_METAL_CHROME,
  LIQUID_METAL_OPACITY,
} from "@/components/ui/liquid-metal-chrome";
import { canRunHeavyEffects, whenPageIdle } from "@/lib/device-capability";
import styles from "./ChromeRim.module.css";

type MetalProps = Record<string, unknown> & { style?: CSSProperties };

/**
 * Liquid-metal chrome that fills the host. Pair with a double-bezel shell
 * (padding + raised inner plate) so only the bezel gap shows as chrome.
 * Same plate params + opacity as button liquid-metal fills.
 * The shader only loads after the page is loaded + idle, and never on phones /
 * low-end devices, which keep a static chrome gradient instead.
 */
export function ChromeRim() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  // capable device + page loaded and idle; checked in an effect (never during
  // render) so the server HTML and hydration match
  const [ready, setReady] = useState(false);
  const [Metal, setMetal] = useState<ComponentType<MetalProps> | null>(null);
  const [params, setParams] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!canRunHeavyEffects()) return;
    return whenPageIdle(() => setReady(true));
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ready || reducedMotion) return;
    let active = true;
    import("@/components/ui/liquid-metal").then((m) => {
      if (!active) return;
      const base = m.liquidMetalPresets[0].params as Record<string, unknown>;
      setParams({ ...base, ...LIQUID_METAL_CHROME });
      setMetal(() => m.default as ComponentType<MetalProps>);
    });
    return () => {
      active = false;
    };
  }, [visible, ready, reducedMotion]);

  if (reducedMotion) return null;

  const live = visible && Metal && params;

  return (
    <div
      ref={hostRef}
      className={[styles.rim, live && styles.live].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {live ? (
        <Metal
          {...params}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            opacity: LIQUID_METAL_OPACITY,
          }}
        />
      ) : null}
    </div>
  );
}
