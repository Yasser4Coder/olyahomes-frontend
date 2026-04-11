/**
 * Interior photo + overlays in the same spirit as TestimonialsSection (home).
 * Swap `SECTION_BG` to `/test-bg.png` when you add that file to `public/`.
 */
const SECTION_BG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=75";

export function SectionImageBackdrop({
  children,
  className = "",
  /** warm: light content. mid: slightly richer paper tone. dark: testimonial-style band for light text */
  tone = "warm",
}) {
  const bgStyle = {
    backgroundImage: `url('${SECTION_BG}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat"
        style={bgStyle}
        aria-hidden
      />

      {tone === "warm" && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(253,251,247,0.97),rgba(253,251,247,0.88)_45%,rgba(247,241,232,0.92))]"
            aria-hidden
          />
          <div
            className="testimonials-glow-left pointer-events-none absolute inset-y-0 left-0 w-[min(52%,26rem)] opacity-[0.35]"
            aria-hidden
          />
          <div
            className="testimonials-glow-right pointer-events-none absolute inset-y-0 right-0 w-[min(52%,26rem)] opacity-[0.35]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.04] via-transparent to-secondary/[0.05]"
            aria-hidden
          />
        </>
      )}

      {tone === "mid" && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgba(253,251,247,0.94),rgba(232,222,208,0.88))]"
            aria-hidden
          />
          <div
            className="testimonials-glow-left pointer-events-none absolute inset-y-0 left-0 w-[min(48%,22rem)] opacity-[0.28]"
            aria-hidden
          />
          <div
            className="testimonials-glow-right pointer-events-none absolute inset-y-0 right-0 w-[min(48%,22rem)] opacity-[0.28]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-secondary/8 to-primary/5"
            aria-hidden
          />
        </>
      )}

      {tone === "dark" && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_100%_at_50%_45%,rgba(12,10,8,0.82),rgba(12,10,8,0.5)_55%,rgba(12,10,8,0.25)_78%)]"
            aria-hidden
          />
          <div
            className="testimonials-glow-left pointer-events-none absolute inset-y-0 left-0 w-[min(55%,28rem)] opacity-90"
            aria-hidden
          />
          <div
            className="testimonials-glow-right pointer-events-none absolute inset-y-0 right-0 w-[min(55%,28rem)] opacity-90"
            aria-hidden
          />
          <div
            className="testimonials-glow-strip pointer-events-none absolute inset-0 opacity-70"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]"
            aria-hidden
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
