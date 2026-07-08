"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/site-data";
import styles from "./SwirlGallery.module.css";

// duotone aurora tints cycled across cards
const TINTS: [string, string][] = [
  ["#ffb03a", "#45e8ff"],
  ["#45e8ff", "#2f7bff"],
  ["#ff4d8d", "#b14dff"],
  ["#ffb03a", "#ff7a1f"],
  ["#2f7bff", "#b14dff"],
  ["#45e8ff", "#ff4d8d"],
  ["#b14dff", "#ffb03a"],
  ["#ff7a1f", "#45e8ff"],
];

export function SwirlGallery({ list }: { list: Project[] }) {
  const n = list.length;
  const step = 360 / Math.max(n, 1);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rot = useRef(-step * 1.6); // start offset so the ring swirls in and settles
  const vel = useRef(2.4);
  const radius = useRef(480);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const dragDist = useRef(0);
  const [focused, setFocused] = useState(0);
  const focusedRef = useRef(0);

  const apply = useCallback(() => {
    const R = radius.current;
    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const angle = i * step + rot.current;
      // signed offset from the front position, in [-180, 180]
      const a = ((((angle + 180) % 360) + 360) % 360) - 180;
      const d01 = Math.pow((Math.cos((a * Math.PI) / 180) + 1) / 2, 1.5);
      el.style.transform =
        `rotateY(${angle}deg) translateZ(${R}px) ` +
        `rotateY(${-angle + a * 0.16}deg) rotateX(11deg) ` +
        `translateY(58px) scale(${0.76 + 0.2 * d01})`;
      el.style.opacity = String(0.14 + 0.86 * d01);
      el.style.filter = `blur(${((1 - d01) * 3).toFixed(2)}px) brightness(${(0.55 + 0.45 * d01).toFixed(3)})`;
      el.style.pointerEvents = d01 > 0.72 ? "auto" : "none";
    }
    const idx = ((Math.round(-rot.current / step) % n) + n) % n;
    if (idx !== focusedRef.current) {
      focusedRef.current = idx;
      setFocused(idx);
    }
  }, [n, step]);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!dragging.current) {
        rot.current += vel.current;
        vel.current *= 0.945;
        if (Math.abs(vel.current) < 0.02) {
          vel.current = 0;
          const target = Math.round(rot.current / step) * step;
          rot.current += (target - rot.current) * 0.085;
        }
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [apply, step]);

  // radius follows stage width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.getBoundingClientRect().width;
      radius.current = Math.max(340, Math.min(600, w * 0.36));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // wheel needs a non-passive listener to preventDefault
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      vel.current = Math.max(-7, Math.min(7, vel.current + e.deltaY * 0.006));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    dragDist.current = 0;
    vel.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    dragDist.current += Math.abs(dx);
    rot.current += dx * 0.16;
    vel.current = dx * 0.16;
  };
  const endDrag = () => {
    dragging.current = false;
  };
  // a real drag shouldn't trigger the card's link on release
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragDist.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") rot.current += step * 0.55, (vel.current = 1.6);
    if (e.key === "ArrowRight") rot.current -= step * 0.55, (vel.current = -1.6);
  };

  const p = list[focused];

  return (
    <div
      className={styles.stage}
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="projects carousel"
    >
      <div className={styles.hint}>↔ drag / scroll to swirl</div>
      <div className={styles.counter}>
        <b>{String(focused + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
      </div>

      <div className={styles.scene}>
        <div className={styles.ring}>
          <div className={styles.hub}>
            {p && (
              <div key={p.slug}>
                <p className={styles.hubMeta}>
                  {p.categories.join(" · ")} — {p.date}
                </p>
                <h2 className={styles.hubName}>{p.name}</h2>
                <p className={styles.hubDesc}>{p.overview}</p>
                <div className={styles.hubGo}>
                  <Link href={`/portfolio/${p.slug}`} className="eng-btn lg" draggable={false}>
                    view case study
                    <span className="eng-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {list.map((proj, i) => {
            const [t1, t2] = TINTS[i % TINTS.length];
            return (
              <div
                key={proj.slug}
                className={styles.card}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={
                  {
                    opacity: 0,
                    "--t1": t1,
                    "--t2": t2,
                    "--cx": `${(i * 37) % 90}%`,
                    "--cy": `${(i * 53) % 60}%`,
                  } as React.CSSProperties
                }
              >
                <Link href={`/portfolio/${proj.slug}`} className={styles.cardCore} draggable={false}>
                  <span className={styles.cardInner}>
                    <span className={styles.cardTop}>
                      <span className={styles.cardIdx}>{String(i + 1).padStart(2, "0")}</span>
                      {proj.xp ? (
                        <span className={styles.cardXp}>↳ {proj.xp.label}</span>
                      ) : (
                        <span>{proj.categories[0]}</span>
                      )}
                    </span>
                    <span className={styles.cardName}>{proj.name}</span>
                    <span className={styles.cardMeta}>
                      {proj.categories.join(" · ")} — {proj.date}
                    </span>
                    <span className={styles.cardChips}>
                      {proj.tech.slice(0, 4).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
