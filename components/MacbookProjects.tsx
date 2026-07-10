"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import { SITE } from "@/lib/site-data";
import styles from "./MacbookProjects.module.css";

function ProjectsScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.chrome} aria-hidden="true">
        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.url}>dhir · projects</div>
      </div>

      <div className={styles.screenHead}>
        <h3 className={styles.screenTitle}>things i&apos;ve built</h3>
      </div>

      <div className={styles.screenCarousel}>
        <ProjectsCarousel list={SITE.projects} compact />
      </div>
    </div>
  );
}

export function MacbookProjects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const macOpacity = useTransform(scrollYProgress, [0.3, 0.45], [1, 0]);
  const expandedOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const expandedScale = useTransform(scrollYProgress, [0.3, 0.45], [0.94, 1]);
  const macPointerEvents = useTransform(scrollYProgress, (v) =>
    v >= 0.4 ? "none" : "auto",
  );
  const expandedPointerEvents = useTransform(scrollYProgress, (v) =>
    v >= 0.4 ? "auto" : "none",
  );

  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));

  return (
    <section className={styles.section} aria-label="projects">
      <div ref={pinRef} className={styles.scrollZone}>
        <div className={styles.stage}>
          <motion.div
            className={styles.macLayer}
            style={{
              opacity: macOpacity,
              pointerEvents: macPointerEvents,
            }}
          >
            <MacbookScroll scrollYProgress={scrollYProgress}>
              <ProjectsScreen />
            </MacbookScroll>
          </motion.div>
        </div>
      </div>

      <motion.div
        className={styles.expandedLayer}
        style={{
          opacity: expandedOpacity,
          scale: expandedScale,
          pointerEvents: expandedPointerEvents,
        }}
      >
        <h2 className={styles.expandedTitle}>things i&apos;ve built</h2>
        <ProjectsCarousel list={SITE.projects} />
      </motion.div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerTitle}>if you want, contact me</h2>

          <div className={styles.footerActions}>
            {email && (
              <WithLiquidMetal as="a" className="eng-btn lg" href={email.href}>
                {email.label}
                <span className="eng-arrow" aria-hidden="true">
                  →
                </span>
              </WithLiquidMetal>
            )}
            <Link className="arrow-link" href="/portfolio">
              all projects
            </Link>
            <nav className={styles.footerLinks} aria-label="social links">
              {external.map((n) => (
                <a key={n.label} href={n.href} target="_blank" rel="noreferrer">
                  {n.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </nav>
          </div>

          <p className={styles.credit}>{SITE.name}</p>
        </div>
      </footer>
    </section>
  );
}
