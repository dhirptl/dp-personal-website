"use client";

import { useState, type ReactNode } from "react";
import type { Project } from "@/lib/site-data";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "@/app/portfolio/portfolio.module.css";

type PortfolioBrowserProps = {
  categories: string[];
  projects: Project[];
  /** Server-rendered header (topbar + title) — kept inside `.inner` with filters. */
  heading: ReactNode;
};

export function PortfolioBrowser({ categories, projects, heading }: PortfolioBrowserProps) {
  const [cat, setCat] = useState("all");

  const filters = ["all", ...categories];
  const list = cat === "all" ? projects : projects.filter((p) => p.categories.includes(cat));

  const count = (c: string) =>
    c === "all" ? projects.length : projects.filter((p) => p.categories.includes(c)).length;

  return (
    <>
      <div className={styles.inner}>
        {heading}
        <div className={`${styles.filters} rv`} style={{ "--d": ".12s" } as React.CSSProperties}>
          {filters.map((f) => (
            <WithLiquidMetal
              key={f}
              as="button"
              className={`eng-btn ${styles.filt}${cat === f ? " on" : ""}`}
              onClick={() => setCat(f)}
            >
              {f}
              <span className={styles.filtCount}>{count(f)}</span>
            </WithLiquidMetal>
          ))}
        </div>
      </div>

      <ProjectsCarousel key={cat} list={list} />
    </>
  );
}
