"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site-data";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { SocialChromeLink } from "@/components/SocialIcons";
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
  const headerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Trap Tab focus inside the panel while open; Escape closes it and the hook
  // restores focus to the hamburger toggle.
  useFocusTrap(panelRef, open, () => setOpen(false));

  const close = useCallback(() => setOpen(false), []);

  // Tap outside the header (menu button + panel) closes the drawer.
  useOutsideClick(headerRef, close, open);

  // Lock background scroll while the mobile menu is open.
  //
  // Only the root element is locked. <html> already has a non-visible
  // overflow (globals.css), so its overflow propagates to the viewport; if
  // <body> also got overflow:hidden it would become its own (non-scrolling)
  // scroll container, the sticky header would stick to body instead of the
  // viewport and jump to its static position (off-screen when scrolled),
  // taking the absolutely-positioned menu panel with it. overflow:hidden on
  // the root keeps the viewport as the scroller, so the scroll offset and the
  // sticky header stay put; iOS Safari 16+ honours it for touch scrolling.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevOverscroll = root.style.overscrollBehavior;
    const scrollY = window.scrollY;
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    return () => {
      root.style.overflow = prevOverflow;
      root.style.overscrollBehavior = prevOverscroll;
      // Some engines can nudge the offset while locked (e.g. iOS toolbar
      // resize); put the page back exactly where the user left it.
      if (Math.abs(window.scrollY - scrollY) > 1) {
        window.scrollTo({ top: scrollY, behavior: "instant" });
      }
    };
  }, [open]);

  // Close the panel whenever the route changes. Adjusted during render
  // (React's documented "adjusting state when a prop changes" pattern)
  // rather than in an effect, to avoid an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  // Close when the viewport grows past the mobile breakpoint — change-only,
  // so a mismatched matchMedia snapshot can't snap-close on open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));

  return (
    <header ref={headerRef} className={styles.header}>
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
            <SocialChromeLink key={n.label} href={n.href} label={n.label} size="sm" />
          ))}
          {email && (
            <SocialChromeLink href={email.href} label={email.label} size="sm" />
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

      <div
        id={PANEL_ID}
        ref={panelRef}
        className={styles.panel}
        data-open={open ? "true" : undefined}
        inert={!open ? true : undefined}
        aria-hidden={!open}
      >
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
                tabIndex={open ? undefined : -1}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.panelExternal}>
          {external.map((n) => (
            <SocialChromeLink
              key={n.label}
              href={n.href}
              label={n.label}
              size="md"
              onClick={close}
            />
          ))}
          {email && (
            <SocialChromeLink
              href={email.href}
              label={email.label}
              size="md"
              onClick={close}
            />
          )}
        </div>
      </div>
    </header>
  );
}
