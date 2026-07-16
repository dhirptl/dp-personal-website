"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import LiquidMetal, { liquidMetalPresets } from "@/components/ui/liquid-metal";
import {
  LIQUID_METAL_CHROME,
  LIQUID_METAL_OPACITY,
} from "@/components/ui/liquid-metal-fill";
import styles from "./ChromeRim.module.css";

const BASE_PARAMS = liquidMetalPresets[0].params as Record<string, unknown>;

/**
 * Liquid-metal chrome that fills the host. Pair with a double-bezel shell
 * (padding + raised inner plate) so only the bezel gap shows as chrome.
 * Same plate params + opacity as button liquid-metal fills.
 */
export function ChromeRim() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

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

  if (reducedMotion) return null;

  const params = { ...BASE_PARAMS, ...LIQUID_METAL_CHROME };

  return (
    <div ref={hostRef} className={styles.rim} aria-hidden="true">
      {visible && (
        <Suspense fallback={null}>
          <LiquidMetal
            {...(params as object)}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              opacity: LIQUID_METAL_OPACITY,
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
