import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site-data";
import { ImageSlot } from "@/components/ImageSlot";
import styles from "./project.module.css";

export function generateStaticParams() {
  return SITE.projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = SITE.projects.findIndex((p) => p.slug === slug);
  const p = SITE.projects[idx];

  if (!p) notFound();

  const next = SITE.projects[(idx + 1) % SITE.projects.length];

  return (
    <main className="container">
      <Link className="back-link rv" href="/portfolio">
        <span>[&lt;]</span> all projects
      </Link>

      <div className={`${styles.cats} rv`} style={{ "--d": ".05s" } as React.CSSProperties}>
        {p.categories.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <h1 className={`gradient-title ${styles.title} rv`} style={{ "--d": ".1s" } as React.CSSProperties}>
        {p.name}
      </h1>
      <div className={`${styles.metarow} rv`} style={{ "--d": ".15s" } as React.CSSProperties}>
        <span className={styles.date}>{p.date}</span>
        {p.xp && (
          <Link className={styles.xp} href={p.xp.route}>
            ↳ {p.xp.label}
          </Link>
        )}
      </div>
      <p className={`${styles.lede} rv`} style={{ "--d": ".2s" } as React.CSSProperties}>
        {p.overview}
      </p>

      <div className={`${styles.hero} rv`} style={{ "--d": ".26s" } as React.CSSProperties}>
        <ImageSlot
          className={styles.heroSlot}
          alt={p.name}
          placeholder={`drop a ${p.name} shot`}
          shape="rounded"
          radius={16}
        />
      </div>

      <div className={styles.body}>
        <div>
          {p.sections.map((s, i) => (
            <div className={styles.sec} key={i}>
              <div className={styles.seclabel}>{s.title}</div>
              {s.body && <p>{s.body}</p>}
              {s.items && (
                <ul>
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <aside className={styles.side}>
          <div>
            <div className={styles.seclabel}>stack</div>
            <div className={styles.chips}>
              {p.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          {p.links && p.links.length > 0 && (
            <div>
              <div className={styles.seclabel}>links</div>
              <div className={styles.links}>
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    <span>{l.label}</span>
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Link className={styles.next} href={`/portfolio/${next.slug}`}>
        <div>
          <div className={styles.lab}>next project</div>
          <div className={styles.nm}>{next.name}</div>
        </div>
        <span className={styles.ar}>→</span>
      </Link>
    </main>
  );
}
