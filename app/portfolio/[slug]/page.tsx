import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site-data";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal } from "@/components/Reveal";
import { ProjectMediaBlocks } from "@/components/ProjectMediaBlocks";
import { getProjectMedia } from "@/lib/project-media";
import { pageMetadata } from "@/lib/metadata";
import { getProjectCardSrc } from "@/lib/project-card-gradient";
import styles from "./project.module.css";

export const dynamic = "force-static";
// only the slugs from generateStaticParams exist; anything else is the static 404
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SITE.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = SITE.projects.find((x) => x.slug === slug);
  if (!p) return {};
  const media = getProjectMedia(p.slug);
  // no hero photo: pageMetadata falls back to the root generated card
  return pageMetadata({
    title: p.name,
    description: p.overview,
    path: `/portfolio/${p.slug}`,
    image: media.hero ? { url: media.hero, alt: media.heroAlt ?? p.name } : undefined,
  });
}

/* Stable per-slug tint index for the gradient card (independent of list order). */
function slugIndex(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 33 + slug.charCodeAt(i)) >>> 0;
  return h;
}

/* site-data link labels may already end in "↗"; the page adds its own arrow */
function cleanLabel(label: string): string {
  return label.replace(/\s*↗\s*$/u, "");
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const idx = SITE.projects.findIndex((p) => p.slug === slug);
  const p = SITE.projects[idx];

  if (!p) notFound();

  const next = SITE.projects[(idx + 1) % SITE.projects.length];
  const media = getProjectMedia(p.slug);

  return (
    <main id="main" className="container">
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

      {media.hero ? (
        <figure className={`${styles.hero} rv`} style={{ "--d": ".26s" } as React.CSSProperties}>
          <ImageSlot
            className={styles.heroSlot}
            src={media.hero}
            alt={media.heroAlt ?? p.name}
            placeholder={p.name}
            shape="rounded"
            radius={16}
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            grayscale={false}
            fit="auto"
          />
          {media.heroCaption && <figcaption className={styles.heroCap}>{media.heroCaption}</figcaption>}
        </figure>
      ) : (
        /* no photography yet: a slim band of the project's chrome gradient card
           (same art family as the carousel cards) instead of an empty slot */
        <div
          className={`${styles.hero} ${styles.heroBand} rv`}
          style={
            {
              "--d": ".26s",
              backgroundImage: `url("${getProjectCardSrc(slugIndex(p.slug), p.slug)}")`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      )}

      <div className={styles.body}>
        <div>
          {p.sections.map((s, i) => (
            <Reveal key={i} className={styles.sec}>
              <h2 className={styles.seclabel}>{s.title}</h2>
              {s.body && <p>{s.body}</p>}
              {s.items && (
                <ul>
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
          <ProjectMediaBlocks media={media} name={p.name} />
        </div>

        <aside className={styles.side}>
          <div>
            <h2 className={styles.seclabel}>stack</h2>
            <div className={styles.chips}>
              {p.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          {p.links && p.links.length > 0 && (
            <div>
              <h2 className={styles.seclabel}>links</h2>
              <div className={styles.links}>
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                    <span>{cleanLabel(l.label)}</span>
                    <span aria-hidden="true">↗</span>
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
