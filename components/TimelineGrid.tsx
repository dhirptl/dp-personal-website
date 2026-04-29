import Link from "next/link";

type TimelineItem = {
  title: string;
  range: string;
  href: string;
};

const timelineItems: TimelineItem[] = [
  {
    title: "Unity and ML Intern, ClutchVR",
    range: "MAY 2026 > AUG 2026",
    href: "/experience/clutchvr",
  },
  {
    title: "Undergraduate Research Assistant, Robotic Navigation",
    range: "JAN 2026 > PRESENT",
    href: "/experience/robotic-navigation",
  },
  {
    title: "Drivetrain Subsystem, Formula SAE",
    range: "JAN 2026 > PRESENT",
    href: "/experience/formula-sae",
  },
];

export function TimelineGrid() {
  return (
    <section aria-labelledby="experience-heading" className="space-y-3">
      <h2 id="experience-heading" className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        Experience & Timeline
      </h2>
      <ul className="flex flex-col gap-2.5 text-sm">
        {timelineItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex w-full flex-col gap-3 py-4 tracking-wide text-neutral-900 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:flex-row sm:items-start sm:justify-between sm:gap-8 md:gap-12 lg:gap-16 dark:text-stone-100 dark:hover:text-stone-300 dark:focus-visible:ring-stone-100"
            >
              <span className="min-w-0 flex-1 break-words md:text-[15px]">{item.title}</span>
              <span className="flex shrink-0 items-baseline gap-4 sm:pt-0.5">
                <span className="whitespace-nowrap text-xs uppercase tracking-wider text-neutral-500 tabular-nums dark:text-neutral-400">
                  {item.range}
                </span>
                <span
                  aria-hidden="true"
                  className="translate-x-0 text-neutral-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-600 dark:text-neutral-400 dark:group-hover:text-emerald-400 motion-reduce:transform-none"
                >
                  [&gt;]
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
