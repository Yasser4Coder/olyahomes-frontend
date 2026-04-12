/**
 * Shared shell for login / sign-up: calm split layout, brand aside on large screens.
 * Pass form content as children.
 */
export default function AuthSplitLayout({
  eyebrow,
  title,
  subtitle,
  asideTitle,
  asideItems,
  children,
}) {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-neutral">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_-10%,rgb(170_99_37/0.12),transparent_55%),radial-gradient(ellipse_70%_60%_at_100%_100%,rgb(150_111_82/0.1),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-5xl gap-0 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <aside className="hidden flex-col justify-center border-b border-secondary/10 px-8 py-12 lg:flex lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-hero-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {asideTitle}
          </h2>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/80">
            {asideItems.map((text) => (
              <li key={text} className="flex gap-3">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/80"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary lg:hidden">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-hero-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70 sm:text-base">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
