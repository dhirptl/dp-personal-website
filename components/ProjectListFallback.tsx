import Link from "next/link";
import type { Project } from "@/lib/site-data";
import styles from "./ProjectListFallback.module.css";

export function ProjectListFallback({ list }: { list: Project[] }) {
  return (
    <div className={styles.list}>
      {list.map((p, i) => (
        <Link className={styles.row} key={p.slug} href={`/portfolio/${p.slug}`}>
          <span className={styles.idx}>{String(i + 1).padStart(2, "0")}</span>
          <span className={styles.body}>
            <span className={styles.name}>{p.name}</span>
            <p className={styles.desc}>{p.overview}</p>
          </span>
          <span className={styles.side}>
            <span>{p.categories.join(" · ")}</span>
            <span>{p.date}</span>
            <span className={styles.arr}>→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
