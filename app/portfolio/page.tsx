"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site-data";
import { useIsNarrow } from "@/lib/useIsNarrow";
import { SwirlGallery } from "@/components/SwirlGallery";
import { ProjectListFallback } from "@/components/ProjectListFallback";
import styles from "./portfolio.module.css";

export default function PortfolioPage() {
  const [cat, setCat] = useState("all");
  const [view, setView] = useState<"swirl" | "list">("swirl");
  const narrow = useIsNarrow(900);

  const filters = ["all", ...SITE.projectCategories];
  const list = cat === "all" ? SITE.projects : SITE.projects.filter((p) => p.categories.includes(cat));

  const count = (c: string) =>
    c === "all" ? SITE.projects.length : SITE.projects.filter((p) => p.categories.includes(c)).length;

  const showSwirl = !narrow && view === "swirl";

  return (
    <main id="main" className={styles.wrap}>
      <div className={styles.inner}>
        <div className={`${styles.topbar} rv`}>
          <Link className="back-link" href="/">
            <span>[&lt;]</span> back
          </Link>
          {!narrow && (
            <div className={styles.switch} role="tablist" aria-label="gallery view">
              <button
                className={`${styles.switchBtn}${view === "swirl" ? ` ${styles.switchOn}` : ""}`}
                onClick={() => setView("swirl")}
                aria-pressed={view === "swirl"}
              >
                spiral
              </button>
              <span className={styles.switchDot} aria-hidden="true"></span>
              <button
                className={`${styles.switchBtn}${view === "list" ? ` ${styles.switchOn}` : ""}`}
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
              >
                list
              </button>
            </div>
          )}
        </div>

        <div className={`${styles.head} rv`} style={{ "--d": ".06s" } as React.CSSProperties}>
          <h1 className={`gradient-title ${styles.title}`}>projects</h1>
          <span className={styles.count}>({SITE.projects.length})</span>
        </div>

        <div className={`${styles.filters} rv`} style={{ "--d": ".12s" } as React.CSSProperties}>
          {filters.map((f) => (
            <button
              key={f}
              className={`eng-btn ${styles.filt}${cat === f ? " on" : ""}`}
              onClick={() => setCat(f)}
            >
              {f}
              <span className={styles.filtCount}>{count(f)}</span>
            </button>
          ))}
        </div>
      </div>

      {showSwirl ? (
        <SwirlGallery key={cat} list={list} />
      ) : (
        <div className={`${styles.listWrap} rv`} style={{ "--d": ".18s" } as React.CSSProperties}>
          <ProjectListFallback list={list} />
        </div>
      )}

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
