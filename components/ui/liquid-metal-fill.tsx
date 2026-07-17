"use client";

import { useEffect, useState, type ComponentType, type CSSProperties } from "react";
import {
  LIQUID_METAL_CHROME,
  LIQUID_METAL_OPACITY,
} from "@/components/ui/liquid-metal-chrome";

export {
  LIQUID_METAL_CHROME,
  LIQUID_METAL_OPACITY,
} from "@/components/ui/liquid-metal-chrome";

type MetalProps = Record<string, unknown> & { style?: CSSProperties };

export function LiquidMetalFill() {
  const [Metal, setMetal] = useState<ComponentType<MetalProps> | null>(null);
  const [params, setParams] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
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
  }, []);

  if (!Metal || !params) return null;

  return (
    <div className="liquid-metal-layer" aria-hidden="true">
      <Metal
        {...params}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          opacity: LIQUID_METAL_OPACITY,
        }}
      />
    </div>
  );
}
