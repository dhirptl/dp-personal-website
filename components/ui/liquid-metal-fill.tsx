"use client";

import { Suspense } from "react";
import LiquidMetal, { liquidMetalPresets } from "@/components/ui/liquid-metal";

const BASE_PARAMS = liquidMetalPresets[0].params as Record<string, unknown>;

const HOVER_PARAMS = {
  fit: "cover",
  softness: 0.15,
  speed: 0.8,
  colorBack: "#1a1a1a",
  colorTint: "#f4f4f5",
  shape: "diamond",
  scale: 2.5,
  distortion: 0.1,
};

export function LiquidMetalFill() {
  const params = { ...BASE_PARAMS, ...HOVER_PARAMS };

  return (
    <div className="liquid-metal-layer" aria-hidden="true">
      <Suspense fallback={null}>
        <LiquidMetal
          {...(params as object)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            opacity: 0.55,
          }}
        />
      </Suspense>
    </div>
  );
}
