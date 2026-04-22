"use client";

import { useEffect } from "react";

const THEME_KEY = "dhir-theme";

export function ThemeToggle() {
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    root.classList.toggle("dark", nextDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 border border-neutral-300 px-3 py-1 text-xs tracking-wide text-neutral-700 hover:border-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-400 dark:hover:text-white dark:focus-visible:ring-stone-200"
      aria-label="Toggle dark mode"
    >
      <span>Theme</span>
      <span aria-hidden="true">[↺]</span>
    </button>
  );
}
