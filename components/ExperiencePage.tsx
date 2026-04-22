import Link from "next/link";

type ExperiencePageProps = {
  title: string;
  period: string;
  overview: string;
  responsibilities: string[];
  outcomes: string[];
  tools: string[];
};

export function ExperiencePage({
  title,
  period,
  overview,
  responsibilities,
  outcomes,
  tools,
}: ExperiencePageProps) {
  return (
    <main className="site-container">
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:text-neutral-400 dark:hover:text-stone-200 dark:focus-visible:ring-stone-100"
        >
          <span aria-hidden="true">[&lt;]</span>
          Back
        </Link>
      </div>

      <article className="space-y-10">
        <header className="space-y-3 border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{period}</p>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{overview}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Responsibilities</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {responsibilities.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Outcomes</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {outcomes.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Tools & Focus</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{tools.join(" · ")}</p>
        </section>
      </article>
    </main>
  );
}
