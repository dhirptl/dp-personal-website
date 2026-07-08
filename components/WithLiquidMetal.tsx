"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { LiquidMetalFill } from "@/components/ui/liquid-metal-fill";

type WithLiquidMetalProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<T>, "as" | "children" | "className">;

export function WithLiquidMetal<T extends ElementType = "button">({
  as,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: WithLiquidMetalProps<T>) {
  const Comp = (as ?? "button") as ElementType;
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleEnter = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setHovered(true);
      if (typeof onMouseEnter === "function") {
        onMouseEnter(e as never);
      }
    },
    [onMouseEnter],
  );

  const handleLeave = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setHovered(false);
      if (typeof onMouseLeave === "function") {
        onMouseLeave(e as never);
      }
    },
    [onMouseLeave],
  );

  const mergedClass = ["liquid-metal-host", className].filter(Boolean).join(" ");

  return (
    <Comp
      className={mergedClass}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {hovered && !reducedMotion && <LiquidMetalFill />}
      {children}
    </Comp>
  );
}
