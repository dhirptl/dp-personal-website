"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { SITE } from "@/lib/site-data";
import { useTyping } from "@/lib/useTyping";
import { ExperienceRow } from "@/components/ExperienceRow";
import { MacbookProjects } from "@/components/MacbookProjects";
import { ChromeRim } from "@/components/ChromeRim";
import styles from "./page.module.css";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function HomePage() {
  const typed = useTyping(SITE.currently, { type: 60, del: 30, pause: 2100 });
  const [loaded, setLoaded] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = hostRef.current?.querySelector("spline-viewer");
    if (!el) return;
    const onLoad = () => setLoaded(true);
    el.addEventListener("load", onLoad);
    const t = setTimeout(() => setLoaded(true), 6000);
    return () => {
      el.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, []);

  return (
    <main id="main" className={`container ${styles.home}`}>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"
        strategy="afterInteractive"
      />

      <div className={`${styles.cardShell} chrome-rim rv`}>
      <ChromeRim />
      <div className={styles.card}>
        <svg className={styles.spotlight} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none">
          <g filter="url(#spotH)">
            <ellipse
              cx="1924.71"
              cy="273.501"
              rx="1924.71"
              ry="273.501"
              transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
              fill="white"
              fillOpacity="0.21"
            ></ellipse>
          </g>
          <defs>
            <filter
              id="spotH"
              x="0.86"
              y="0.84"
              width="3785.16"
              height="2840.26"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="151" result="b"></feGaussianBlur>
            </filter>
          </defs>
        </svg>

        <div className={styles.left}>
          <p className={styles.kicker}>hi, i&apos;m</p>
          <h1 className={styles.name} aria-label={SITE.first}>
            {SITE.first.split("").map((ch, i) => (
              <span key={i} className={styles.nameClip} aria-hidden="true">
                <span className={styles.nameL} style={{ "--i": i } as React.CSSProperties}>
                  {ch}
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.currentlyRow}>
            <span className={styles.lab}>currently</span>
            {typed}
            <span className={styles.caret}></span>
          </p>
          <p className={styles.meta}>{SITE.meta.join(" · ")}</p>
        </div>

        <div className={`${styles.right}${loaded ? ` ${styles.on}` : ""}`} ref={hostRef}>
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <span className={styles.loaderLabel}>loading scene…</span>
          </div>
          <spline-viewer url={SPLINE_SCENE_URL}></spline-viewer>
        </div>

        <div className={styles.cardGlow} aria-hidden="true"></div>
      </div>
      </div>

      <div className={styles.below}>
        <div className="rv" style={{ "--d": ".18s" } as React.CSSProperties}>
          <div className={styles.exphead}>experience</div>
          {SITE.experience.map((e) => (
            <ExperienceRow
              key={e.slug}
              title={e.title}
              org={e.org}
              range={e.range}
              now={e.now}
              href={`/experience/${e.slug}`}
            />
          ))}
        </div>
      </div>

      <MacbookProjects />
    </main>
  );
}
