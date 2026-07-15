"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type ElementType,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
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
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
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
      // Fine pointer: hover. Coarse: press handlers drive the flash.
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

  const isTouchy = useCallback(
    (e: PointerEvent<HTMLElement>) =>
      coarsePointer || e.pointerType === "touch" || e.pointerType === "pen",
    [coarsePointer],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Touch/pen press flash (and coarse pointers); mouse keeps hover path.
      if (isTouchy(e)) setHovered(true);
      if (typeof onPointerDown === "function") {
        onPointerDown(e as never);
      }
    },
    [onPointerDown, isTouchy],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isTouchy(e)) setHovered(false);
      if (typeof onPointerUp === "function") {
        onPointerUp(e as never);
      }
    },
    [onPointerUp, isTouchy],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isTouchy(e)) setHovered(false);
      if (typeof onPointerCancel === "function") {
        onPointerCancel(e as never);
      }
    },
    [onPointerCancel, isTouchy],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isTouchy(e)) setHovered(false);
      if (typeof onPointerLeave === "function") {
        onPointerLeave(e as never);
      }
    },
    [onPointerLeave, isTouchy],
  );

  const mergedClass = ["liquid-metal-host", className].filter(Boolean).join(" ");
  // Coarse gets a brief press flash; fine pointer keeps hover. Shader skipped when reduced.
  const showFill = hovered && !reducedMotion;

  return (
    <Comp
      className={mergedClass}
      {...rest}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
    >
      {showFill && <LiquidMetalFill />}
      {children}
    </Comp>
  );
}
