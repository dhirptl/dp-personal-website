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
    range: "JAN 2026 > APR 2026",
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
    <section aria-labelledby="experience-heading" className="space-y-5">
      <h2 id="experience-heading" className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        Experience & Timeline
      </h2>
      <ul className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {timelineItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group grid grid-cols-1 gap-3 px-0 py-5 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <span className="font-medium text-neutral-900 group-hover:text-neutral-700 dark:text-stone-100 dark:group-hover:text-stone-300">
                {item.title}
              </span>
              <span className="text-xs uppercase tracking-wider text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-stone-300">
                {item.range}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
