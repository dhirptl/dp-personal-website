import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { label: "About Me", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Email", href: "#" },
];

export function NavLinks() {
  return (
    <nav aria-label="Primary" className="space-y-4">
      <ul className="grid gap-3 text-sm">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-2 tracking-wide text-neutral-900 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:text-stone-100 dark:hover:text-stone-300 dark:focus-visible:ring-stone-100"
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="translate-x-0 text-neutral-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-600 dark:text-neutral-400 dark:group-hover:text-emerald-400 motion-reduce:transform-none"
              >
                [&gt;]
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
