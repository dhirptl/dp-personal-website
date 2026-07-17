"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  LIQUID_METAL_CHROME,
  LIQUID_METAL_OPACITY,
} from "@/components/ui/liquid-metal-chrome";
import styles from "./ChromeRim.module.css";

type MetalProps = Record<string, unknown> & { style?: CSSProperties };

/**
 * Liquid-metal chrome that fills the host. Pair with a double-bezel shell
 * (padding + raised inner plate) so only the bezel gap shows as chrome.
 * Same plate params + opacity as button liquid-metal fills.
 */
export function ChromeRim() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
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
    if (!visible || reducedMotion) return;
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
  }, [visible, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={hostRef} className={styles.rim} aria-hidden="true">
      {visible && Metal && params ? (
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
