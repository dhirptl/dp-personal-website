"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import {
  MACBOOK_PHASE,
  MacbookScroll,
} from "@/components/ui/macbook-scroll";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { SocialChromeLink } from "@/components/SocialIcons";
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

function isSettled(v: number) {
  return v >= MACBOOK_PHASE.settleEnd - 0.005;
}

function ContactsFooter() {
  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <h2 className={styles.footerTitle}>my contacts</h2>

        <nav className={styles.footerLinks} aria-label="social links">
          {external.map((n) => (
            <SocialChromeLink key={n.label} href={n.href} label={n.label} size="lg" />
          ))}
          {email && (
            <SocialChromeLink href={email.href} label={email.label} size="lg" />
          )}
        </nav>
      </div>
    </footer>
  );
}

export function MacbookProjects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // rAF sampling — window "scroll" events are unreliable with sticky pinning.
  // Pause when the pin zone is off-screen to avoid burning mobile battery.
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    let raf = 0;
    let visible = true;

    const tick = () => {
      raf = 0;
      if (!visible) return;

      if (reducedMotion) {
        // Jump to open + interactive hold; skip the long pin choreography.
        scrollYProgress.set(
          (MACBOOK_PHASE.settleEnd + MACBOOK_PHASE.exitStart) / 2,
        );
      } else {
        const total = el.offsetHeight || 1;
        const p = Math.min(
          1,
          Math.max(0, -el.getBoundingClientRect().top / total),
        );
        scrollYProgress.set(p);
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollYProgress, reducedMotion]);

  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    setInteractive(isSettled(scrollYProgress.get()));
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setInteractive(isSettled(v));
    if (pinRef.current) pinRef.current.dataset.progress = v.toFixed(3);
  });

  return (
    <section className={styles.section} aria-label="projects">
      <div
        ref={pinRef}
        className={`${styles.scrollZone}${reducedMotion ? ` ${styles.scrollZoneReduced}` : ""}`}
      >
        <div className={styles.stage}>
          <div
            className={styles.macLayer}
            inert={!interactive ? true : undefined}
          >
            <MacbookScroll scrollYProgress={scrollYProgress}>
              <ProjectsScreen />
            </MacbookScroll>
          </div>
        </div>
      </div>

      <ContactsFooter />
    </section>
  );
}
