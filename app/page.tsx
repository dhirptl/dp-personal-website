import { SITE } from "@/lib/site-data";
import { ExperienceRow } from "@/components/ExperienceRow";
import { MacbookProjects } from "@/components/MacbookProjects";
import { ChromeRim } from "@/components/ChromeRim";
import { CurrentlyTyping } from "@/components/CurrentlyTyping";
import { SplineHero } from "@/components/SplineHero";
import styles from "./page.module.css";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main id="main" className={`container ${styles.home}`}>
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
              <CurrentlyTyping phrases={SITE.currently} />
              <span className={styles.caret}></span>
            </p>
            <p className={styles.meta}>{SITE.meta.join(" · ")}</p>
          </div>

          <SplineHero />

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
