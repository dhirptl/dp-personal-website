import Link from "next/link";

export default function AboutPage() {
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
      <section className="max-w-2xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Me</h1>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          This page is a placeholder route for your expanded biography. You can later add your background, interests,
          engineering values, and what you are currently building.
        </p>
      </section>
    </main>
  );
}
