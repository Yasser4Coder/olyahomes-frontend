export default function DashboardPageHeader({ eyebrow, title, description }) {
  return (
    <header className="mb-8 shrink-0">
      {eyebrow ? (
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-[clamp(1.5rem,3.2vw,2rem)] font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/60 sm:text-base">{description}</p> : null}
    </header>
  );
}
