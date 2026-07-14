"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type ElementType,
  type FocusEvent,
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
  onFocus,
  onBlur,
  ...rest
}: WithLiquidMetalProps<T>) {
  const Comp = (as ?? "button") as ElementType;
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const updateMotion = () => setReducedMotion(motionMq.matches);
    const updateCoarse = () => setCoarsePointer(coarseMq.matches);
    updateMotion();
    updateCoarse();
    motionMq.addEventListener("change", updateMotion);
    coarseMq.addEventListener("change", updateCoarse);
    return () => {
      motionMq.removeEventListener("change", updateMotion);
      coarseMq.removeEventListener("change", updateCoarse);
    };
  }, []);

  const handleEnter = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!coarsePointer) setHovered(true);
      if (typeof onMouseEnter === "function") {
        onMouseEnter(e as never);
      }
    },
    [onMouseEnter, coarsePointer],
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

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      if (!coarsePointer) setHovered(true);
      if (typeof onFocus === "function") {
        onFocus(e as never);
      }
    },
    [onFocus, coarsePointer],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      setHovered(false);
      if (typeof onBlur === "function") {
        onBlur(e as never);
      }
    },
    [onBlur],
  );

  const mergedClass = ["liquid-metal-host", className].filter(Boolean).join(" ");
  const showFill = hovered && !reducedMotion && !coarsePointer;

  return (
    <Comp
      className={mergedClass}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {showFill && <LiquidMetalFill />}
      {children}
    </Comp>
  );
}
