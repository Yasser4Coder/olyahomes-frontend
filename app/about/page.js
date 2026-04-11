import Image from "next/image";
import Link from "next/link";
import { sampleListings } from "@/lib/sampleListings";

/**
 * Default imagery uses listing photos so the page works before you add files.
 * Replace with local assets under `public/images/about/` when ready, e.g. `/images/about/hero-collage-1.jpg`.
 */
const pick = (i) => sampleListings[i % sampleListings.length].coverImage;

const aboutImages = {
  heroCollage: [pick(0), pick(1), pick(2)],
  mission: pick(3),
  team: [pick(4), pick(5), pick(6), pick(7)],
  blog: [pick(8), pick(9), pick(10)],
};

export const metadata = {
  title: "About",
  description:
    "Learn about Olyahomes—our mission, team, and how we help guests and hosts book with confidence.",
};

const valuePillars = [
  {
    label: "Fastest",
    body: "Find and compare homes without friction.",
    Icon: IconStopwatch,
  },
  {
    label: "Efficient",
    body: "Clear flows from search to booking.",
    Icon: IconEnvelope,
  },
  {
    label: "Reliable",
    body: "Consistent details and expectations.",
    Icon: IconThumbsUp,
  },
  {
    label: "Strategy",
    body: "Built for growth as you add listings.",
    Icon: IconChart,
  },
];

const missionBullets = [
  "Transparent pricing and totals guests can understand.",
  "Readable house rules and cancellation expectations.",
  "Support that stays reachable before, during, and after the stay.",
];

const stats = [
  { value: "105+", label: "Happy guests" },
  { value: "40+", label: "Homes listed" },
  { value: "12", label: "Cities" },
  { value: "24/7", label: "Support mindset" },
];

const team = [
  {
    name: "Add name",
    role: "Founder & CEO",
    imageIndex: 0,
  },
  {
    name: "Add name",
    role: "Head of Operations",
    imageIndex: 1,
  },
  {
    name: "Add name",
    role: "Guest experience",
    imageIndex: 2,
  },
  {
    name: "Add name",
    role: "Host partnerships",
    imageIndex: 3,
  },
];

const posts = [
  {
    href: "/faq",
    imageIndex: 0,
    meta: "Tips · Booking",
    title: "How to pick the right stay for your trip",
    excerpt:
      "A short checklist for comparing listings—location, amenities, and what to ask before you book.",
  },
  {
    href: "/how-it-works",
    imageIndex: 1,
    meta: "Guide · Hosts",
    title: "Listing your home with clarity",
    excerpt:
      "Why structured photos and rules help the right guests say yes—and reduce back-and-forth.",
  },
  {
    href: "/contact",
    imageIndex: 2,
    meta: "Company · Updates",
    title: "What we’re building next at Olyahomes",
    excerpt:
      "Payments, calendars, and messaging—how the product will evolve while keeping the UX calm.",
  },
];

function IconStopwatch({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 10v4l2.5 1.5M9 3h6M12 3v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconEnvelope({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 6h16v12H4V6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconThumbsUp({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 11V20H4v-9h3zm0 0l4-7a2 2 0 0 1 2-1h1a3 3 0 0 1 3 3v2h2a3 3 0 0 1 3 3l-1 5a3 3 0 0 1-3 2h-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 20V4M8 20V12M12 20V8M16 20V14M20 20V6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* —— Hero —— */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-10 lg:px-14">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
          About us
        </p>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <h1 className="font-hero-serif text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.12] tracking-tight text-foreground">
              Good design makes a product useful.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/65 sm:text-[1.05rem]">
              Olyahomes connects travellers with welcoming homes and gives hosts the tools to present
              their spaces clearly. We believe booking should feel calm—transparent totals, readable
              rules, and support that feels human.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 ring-1 ring-primary/20 transition hover:bg-primary/90"
              >
                Browse homes
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-secondary/20 bg-white px-6 py-3.5 text-sm font-semibold text-foreground/85 shadow-sm transition hover:bg-zinc-50"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-4/3 w-full">
              <div className="absolute left-0 top-0 w-[58%] overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(44,36,25,0.45)] ring-1 ring-secondary/10">
                <Image
                  src={aboutImages.heroCollage[0]}
                  alt=""
                  width={560}
                  height={420}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute right-0 top-0 w-[58%] overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(44,36,25,0.45)] ring-1 ring-secondary/10">
                <Image
                  src={aboutImages.heroCollage[1]}
                  alt=""
                  width={560}
                  height={420}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-1/2 w-[64%] -translate-x-1/2 overflow-hidden rounded-2xl shadow-[0_22px_48px_-20px_rgba(44,36,25,0.4)] ring-1 ring-secondary/10">
                <Image
                  src={aboutImages.heroCollage[2]}
                  alt=""
                  width={640}
                  height={380}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Value proposition —— */}
      <section className="border-t border-secondary/15 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {valuePillars.map(({ label, body, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col rounded-2xl border border-secondary/12 bg-[#fdfbf7] p-5 shadow-[0_12px_36px_-28px_rgba(44,36,25,0.35)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-sm font-bold text-foreground">{label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{body}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-hero-serif text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-tight text-foreground">
                Level up your hosting with Olyahomes
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/65">
                Whether you list one property or many, guests decide faster when photos, amenities,
                and policies are structured the same way every time. That consistency is what turns
                browsing into confident bookings.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/65">
                We’re building the flows you need next—payments, calendars, and messaging—without
                sacrificing the warm, residential feel that makes Olyahomes different.
              </p>
              <Link
                href="/how-it-works"
                className="mt-6 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* —— Mission —— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14">
          <div>
            <h2 className="font-hero-serif text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-tight text-foreground">
              Our mission is to change how people book a home
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              Travel should feel straightforward. We focus on the details that reduce anxiety:
              what you pay, what you can expect, and how to get help when plans change.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foreground/70">
              {missionBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/faq"
              className="mt-8 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Learn more
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white/50 shadow-[0_24px_56px_-32px_rgba(44,36,25,0.45)] ring-1 ring-secondary/10">
            <Image
              src={aboutImages.mission}
              alt=""
              width={900}
              height={680}
              className="aspect-4/3 w-full object-cover md:aspect-auto md:min-h-[320px]"
            />
          </div>
        </div>
      </section>

      {/* —— Stats (wavy band) —— */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-neutral-dark/80"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
          <svg
            className="absolute -bottom-24 left-0 h-48 w-[140%] max-w-none text-white/40 sm:h-64"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,80 C200,20 400,100 600,50 C800,0 1000,80 1200,40 L1200,120 L0,120 Z"
            />
          </svg>
          <svg
            className="absolute -top-8 right-0 h-40 w-[120%] max-w-none text-white/25 sm:h-52"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,60 C300,100 500,0 800,40 C1000,70 1100,20 1200,50 L1200,0 L0,0 Z"
            />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-14">
          <div className="text-center">
            <h2 className="font-hero-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Olyahomes in numbers
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-foreground/60">
              Replace these figures with your real metrics as you grow—guests served, homes on platform,
              cities, and milestones.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center md:px-4 ${i > 0 ? "md:border-l md:border-secondary/20" : ""}`}
              >
                <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— Team —— */}
      <section className="border-t border-secondary/15 bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
                Team
              </p>
              <h2 className="font-hero-serif mt-2 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-tight text-foreground">
                People behind Olyahomes
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/65">
                Swap in your real team photos and bios. These placeholders keep the layout ready.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <article
                key={m.name + m.role}
                className="overflow-hidden rounded-2xl border border-secondary/12 bg-[#fdfbf7] shadow-[0_14px_40px_-28px_rgba(44,36,25,0.35)]"
              >
                <div className="relative aspect-square w-full bg-neutral-dark/30">
                  <Image
                    src={aboutImages.team[m.imageIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <p className="mt-0.5 text-sm text-foreground/55">{m.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* —— Blog —— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14 lg:py-20">
        <div className="text-center">
          <h2 className="font-hero-serif text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold text-foreground">
            Latest from Olyahomes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/60">
            Point these cards to real blog posts when you have a CMS—or use them as quick links to key
            guides on the site.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-secondary/12 bg-white shadow-[0_14px_40px_-28px_rgba(44,36,25,0.28)] transition hover:border-primary/25 hover:shadow-[0_20px_48px_-28px_rgba(44,36,25,0.35)]"
            >
              <div className="relative aspect-16/10 w-full bg-neutral-dark/20">
                <Image
                  src={aboutImages.blog[post.imageIndex]}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/45">
                  {post.meta}
                </p>
                <p className="mt-2 font-semibold leading-snug text-foreground group-hover:text-primary">
                  {post.title}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60">{post.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-primary">Read article →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* —— Newsletter —— */}
      <section className="border-t border-secondary/15 bg-white/70">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 md:px-10 lg:px-14">
          <h2 className="font-hero-serif text-xl font-semibold text-foreground sm:text-2xl">
            Subscribe for updates
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/60">
            Get product news and hosting tips. Wire your email provider when you’re ready.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch">
            <label htmlFor="about-newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="about-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="min-h-12 w-full flex-1 rounded-2xl border border-secondary/20 bg-[#fdfbf7] px-4 py-3 text-sm text-foreground outline-none ring-primary focus:ring-2"
            />
            <button
              type="button"
              className="min-h-12 shrink-0 rounded-2xl bg-zinc-900 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:rounded-2xl"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
