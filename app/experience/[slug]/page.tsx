import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site-data";
import { Reveal } from "@/components/Reveal";
import styles from "./experience.module.css";

export function generateStaticParams() {
  return Object.keys(SITE.expDetail).map((slug) => ({ slug }));
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = SITE.expDetail[slug as keyof typeof SITE.expDetail];

  if (!e) notFound();

  const linkedProjects = (e.projects ?? [])
    .map((s) => SITE.projects.find((p) => p.slug === s))
    .filter((p): p is (typeof SITE.projects)[number] => Boolean(p));

  return (
    <main id="main" className="container">
      <Link className="back-link rv" href="/">
        <span>[&lt;]</span> back to home
      </Link>

      <div className={`${styles.metarow} rv`} style={{ "--d": ".05s" } as React.CSSProperties}>
        {e.status && <span className={styles.now}>{e.status}</span>}
        {e.location && <span className={styles.tag}>{e.location}</span>}
        {e.team && <span className={styles.tag}>{e.team}</span>}
      </div>

      <h1 className={`gradient-title ${styles.title} rv`} style={{ "--d": ".1s" } as React.CSSProperties}>
        {e.role}
      </h1>
      <p className={`${styles.at} rv`} style={{ "--d": ".15s" } as React.CSSProperties}>
        <span className={styles.atLab}>at </span>
        <a className={styles.org} href={e.orgHref} target="_blank" rel="noreferrer">
          {e.org}
          <span className={styles.ext}>↗</span>
        </a>
      </p>
      <p className={styles.range}>{e.range}</p>

      <p className={styles.lede}>{e.summary}</p>

      <div className={styles.body}>
        <div>
          {e.responsibilities && e.responsibilities.length > 0 && (
            <Reveal className={styles.sec}>
              <div className={styles.seclabel}>responsibilities</div>
              <ul>
                {e.responsibilities.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {e.accomplishments && e.accomplishments.length > 0 && (
            <Reveal className={styles.sec}>
              <div className={styles.seclabel}>what i accomplished</div>
              <ul>
                {e.accomplishments.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {e.focus && e.focus.length > 0 && (
            <Reveal className={styles.sec}>
              <div className={styles.seclabel}>what i&apos;m focused on</div>
              <ul>
                {e.focus.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </Reveal>
          )}
          {e.growth && (
            <Reveal className={styles.sec}>
              <div className={styles.seclabel}>professional growth</div>
              <p>{e.growth}</p>
            </Reveal>
          )}
          {e.teamwork && (
            <Reveal className={styles.sec}>
              <div className={styles.seclabel}>teamwork & responsibility</div>
              <p>{e.teamwork}</p>
            </Reveal>
          )}
        </div>

        <aside className={styles.side}>
          <div>
            <div className={styles.seclabel}>at a glance</div>
            <div className={styles.metaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>company</span>
                <a className={styles.metaOrgLink} href={e.orgHref} target="_blank" rel="noreferrer">
                  {e.org} ↗
                </a>
              </div>
              {e.team && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>team</span>
                  <span className={styles.metaVal}>{e.team}</span>
                </div>
              )}
              {e.location && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>location</span>
                  <span className={styles.metaVal}>{e.location}</span>
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>dates</span>
                <span className={styles.metaVal}>{e.range}</span>
              </div>
            </div>
          </div>

          {e.stack && e.stack.length > 0 && (
            <div>
              <div className={styles.seclabel}>stack</div>
              <div className={styles.chips}>
                {e.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {linkedProjects.length > 0 && (
            <div>
              <div className={styles.seclabel}>projects from this role</div>
              <div className={styles.projlinks}>
                {linkedProjects.map((p) => (
                  <Link key={p.slug} href={`/portfolio/${p.slug}`}>
                    <span className={styles.pn}>
                      {p.name}
                      <span>→</span>
                    </span>
                    <span className={styles.pd}>{p.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <nav className={styles.footnav}>
        <Link className="arrow-link" href="/">
          home
        </Link>
        <Link className="arrow-link" href="/portfolio">
          all projects
        </Link>
        <Link className="arrow-link" href="/about">
          about me
        </Link>
      </nav>
    </main>
  );
}
