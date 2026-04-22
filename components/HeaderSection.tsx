export function HeaderSection() {
  return (
    <header className="space-y-3 border-b border-neutral-200 pb-10 dark:border-neutral-800">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Personal Site</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Dhir Patel</h1>
      <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
        <p>BSc Engineering</p>
        <p>University of Alberta (Class of 2029)</p>
      </div>
    </header>
  );
}
