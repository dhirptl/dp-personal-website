"use client";

import Link from "next/link";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "./ExperienceRow.module.css";

export type ExperienceRowProps = {
  title: string;
  org: string;
  range: string;
  now?: boolean;
  /** When provided, the row renders as a liquid-metal hover link.
      Omit for entries that have no detail page. */
  href?: string;
};

export function ExperienceRow({ title, org, range, now, href }: ExperienceRowProps) {
  const content = (
    <>
      <span className={styles.title}>{title}</span>
      <span className={styles.org}>{org}</span>
      {now && <span className={styles.now}>now</span>}
      <span className={styles.range}>{range}</span>
    </>
  );

  if (!href) {
    return <div className={styles.exp}>{content}</div>;
  }

  return (
    <WithLiquidMetal as={Link} className={`${styles.exp} ${styles.link}`} href={href}>
      {content}
    </WithLiquidMetal>
  );
}
