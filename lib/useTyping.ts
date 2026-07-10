"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type TypingOptions = {
  type?: number;
  del?: number;
  pause?: number;
};

type Phase = "typing" | "pausing" | "deleting";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTyping(phrases: string[], opts: TypingOptions = {}) {
  const { type = 70, del = 38, pause = 1900 } = opts;
  const first = phrases[0] ?? "";
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reducedMotion) return;

    const cur = phrases[i % phrases.length];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < cur.length) {
        t = setTimeout(() => setText(cur.slice(0, text.length + 1)), type);
      } else {
        t = setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      t = setTimeout(() => setPhase("deleting"), pause);
    } else if (text.length > 0) {
      t = setTimeout(() => setText(cur.slice(0, text.length - 1)), del);
    } else {
      t = setTimeout(() => {
        setI((p) => (p + 1) % phrases.length);
        setPhase("typing");
      }, 220);
    }

    return () => clearTimeout(t);
  }, [text, phase, i, phrases, type, del, pause, reducedMotion]);

  if (reducedMotion) return first;
  return text;
}
