"use client";

import { useEffect, useState } from "react";

const roles = ["student.", "innovator.", "programmer."] as const;
const typingDelayMs = 90;
const deletingDelayMs = 60;
const pauseDelayMs = 3000;

type Phase = "typing" | "pausing" | "deleting";

export function HeaderSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (visibleText.length < currentRole.length) {
        timeoutId = setTimeout(() => {
          setVisibleText(currentRole.slice(0, visibleText.length + 1));
        }, typingDelayMs);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("pausing");
        }, pauseDelayMs);
      }
    } else if (phase === "pausing") {
      timeoutId = setTimeout(() => {
        setPhase("deleting");
      }, deletingDelayMs);
    } else if (visibleText.length > 0) {
      timeoutId = setTimeout(() => {
        setVisibleText(currentRole.slice(0, visibleText.length - 1));
      }, deletingDelayMs);
    } else {
      timeoutId = setTimeout(() => {
        setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        setPhase("typing");
      }, deletingDelayMs);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phase, roleIndex, visibleText]);

  return (
    <header className="space-y-4 pb-8">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        hi i&apos;m dhir, i&apos;m a{" "}
        <span className="text-emerald-600 dark:text-emerald-400">{visibleText}</span>
      </h1>
      <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
        <p>BSc Engineering</p>
        <p>University of Alberta (Class of 2029)</p>
      </div>
    </header>
  );
}
