"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site-data";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "./portfolio.module.css";

export default function PortfolioPage() {
  const [cat, setCat] = useState("all");

  const filters = ["all", ...SITE.projectCategories];
  const list = cat === "all" ? SITE.projects : SITE.projects.filter((p) => p.categories.includes(cat));

  const count = (c: string) =>
    c === "all" ? SITE.projects.length : SITE.projects.filter((p) => p.categories.includes(c)).length;

  return (
    <main id="main" className={styles.wrap}>
      <div className={styles.inner}>
        <div className={`${styles.topbar} rv`}>
          <Link className="back-link" href="/">
            <span>[&lt;]</span> back
          </Link>
        </div>

        <div className={`${styles.head} rv`} style={{ "--d": ".06s" } as React.CSSProperties}>
          <h1 className={`gradient-title ${styles.title}`}>projects</h1>
          <span className={styles.count}>({SITE.projects.length})</span>
        </div>

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

      <div className={styles.foot}>
        <Link className="arrow-link" href="/">
          home
        </Link>
        <Link className="arrow-link" href="/about">
          about me
        </Link>
      </div>
    </main>
  );
}
