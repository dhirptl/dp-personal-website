"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site-data";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "./SiteHeader.module.css";

const PRIMARY = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
  { label: "portfolio", href: "/portfolio" },
] as const;

const PANEL_ID = "site-nav-panel";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Trap Tab focus inside the mobile panel while it's open; Escape closes it
  // and the hook restores focus to the hamburger toggle automatically.
  useFocusTrap(panelRef, open, () => setOpen(false));

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close the panel whenever the route changes. Adjusted during render
  // (React's documented "adjusting state when a prop changes" pattern,
  // using state rather than a ref since refs can't be read during render)
  // rather than in an effect, to avoid an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  // If the viewport grows past the mobile breakpoint while the panel is open,
  // close it — otherwise the focus trap would hold focus in a hidden panel.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));
  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          {SITE.name}
        </Link>

        <nav className={styles.primary} aria-label="primary">
          {PRIMARY.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`${styles.navLink}${active ? ` ${styles.active}` : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.right}>
          {external.map((n) => (
            <a key={n.label} className={styles.extLink} href={n.href} target="_blank" rel="noreferrer">
              {n.label}
              <span className={styles.ext} aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
          {email && (
            <WithLiquidMetal as="a" className={`eng-btn ${styles.cta}`} href={email.href}>
              {email.label}
            </WithLiquidMetal>
          )}
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">[{open ? "x" : "="}]</span> menu
        </button>
      </div>

      {open && (
        <div id={PANEL_ID} ref={panelRef} className={styles.panel}>
          <nav className={styles.panelPrimary} aria-label="primary">
            {PRIMARY.map((n) => {
              const active = isActive(pathname, n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`${styles.panelLink}${active ? ` ${styles.panelActive}` : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className={styles.panelExternal}>
            {external.map((n) => (
              <a
                key={n.label}
                className={styles.extLink}
                href={n.href}
                target="_blank"
                rel="noreferrer"
                onClick={close}
              >
                {n.label}
                <span className={styles.ext} aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
            {email && (
              <WithLiquidMetal
                as="a"
                className={`eng-btn ${styles.cta}`}
                href={email.href}
                onClick={close}
              >
                {email.label}
              </WithLiquidMetal>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
