import Link from "next/link";

export default function DashboardStatCard({ label, value, hint, trend, href }) {
  const card = (
    <div className="rounded-2xl border border-secondary/12 bg-white p-5 shadow-sm ring-1 ring-foreground/5 transition hover:border-primary/25">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-foreground/45">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-foreground/55">{hint}</p> : null}
      {trend ? (
        <p className="mt-3 text-xs font-semibold text-primary" aria-label="Trend">
          {trend}
        </p>
      ) : null}
    </div>
  );

  return href ? (
    <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl">
      {card}
    </Link>
  ) : (
    card
  );
}
