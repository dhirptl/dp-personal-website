"use client";

import Link from "next/link";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import type { Project } from "@/lib/site-data";
import { getProjectCardSrc } from "@/lib/project-card-gradient";
import styles from "./ProjectsCarousel.module.css";

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <div className={styles.modalBody}>
      <div className={styles.meta}>
        <span>{project.date}</span>
        {project.xp && (
          <Link className={styles.xp} href={project.xp.route}>
            ↳ {project.xp.label}
          </Link>
        )}
      </div>
      <p className={styles.overview}>{project.overview}</p>
      <div className={styles.chips}>
        {project.tech.map((t) => (
          <span key={t} className={styles.chip}>
            {t}
          </span>
        ))}
      </div>
      <div className={styles.cta}>
        <Link className="eng-btn lg" href={`/portfolio/${project.slug}`}>
          view case study
          <span className="eng-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

export function ProjectsCarousel({ list }: { list: Project[] }) {
  const items = list.map((p, i) => (
    <Card
      key={p.slug}
      index={i}
      card={{
        src: getProjectCardSrc(i, p.slug),
        title: p.name,
        category: p.categories.join(" · "),
        content: <ProjectCardContent project={p} />,
      }}
    />
  ));

  return (
    <div className={styles.wrap} aria-label="projects carousel">
      <Carousel items={items} />
    </div>
  );
}
