"use client";

import { Suspense } from "react";
import LiquidMetal, { liquidMetalPresets } from "@/components/ui/liquid-metal";

const BASE_PARAMS = liquidMetalPresets[0].params as Record<string, unknown>;

/** Shared chrome plate — used by button fills and ChromeRim bezels. */
export const LIQUID_METAL_CHROME = {
  fit: "cover",
  softness: 0.15,
  speed: 0.8,
  colorBack: "#1a1a1a",
  colorTint: "#f4f4f5",
  shape: "diamond",
  scale: 2.5,
  distortion: 0.1,
} as const;

export const LIQUID_METAL_OPACITY = 0.55;

export function LiquidMetalFill() {
  const params = { ...BASE_PARAMS, ...LIQUID_METAL_CHROME };

  return (
    <div className="liquid-metal-layer" aria-hidden="true">
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
    </div>
  );
}
