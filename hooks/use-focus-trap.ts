import React, { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

/**
 * Traps keyboard focus inside `ref`'s element while `active` is true.
 *
 * - Tab / Shift+Tab cycle within the container's focusable elements.
 * - Escape calls `onClose` (if provided).
 * - On activation, focus moves to the first focusable element inside the
 *   container (or the container itself if none exist).
 * - On deactivation/unmount, focus returns to whatever element had focus
 *   before the trap activated.
 *
 * Intended for modal dialogs and the mobile nav panel. Motion concerns
 * (prefers-reduced-motion) are deliberately out of scope here.
 */
export const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onClose?: () => void,
) => {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Move focus in on activation; restore it on deactivation/unmount.
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const first = getFocusable(container)[0];
    if (first) {
      first.focus();
    } else {
      if (!container.hasAttribute("tabindex")) container.tabIndex = -1;
      container.focus();
    }

    return () => {
      const previous = previouslyFocused.current;
      previouslyFocused.current = null;
      if (previous && previous.isConnected) previous.focus();
    };
  }, [ref, active]);

  // Tab cycling + Escape while active.
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const container = ref.current;
      if (!container) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      // Focus escaped the container (or never entered): pull it back in.
      if (!(current instanceof HTMLElement) || !container.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref, active]);
};
