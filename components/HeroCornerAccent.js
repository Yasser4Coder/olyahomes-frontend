/**
 * Top-left hero detail: ultra-light grid + neutral haze (static, no frames or brand wash).
 */
export default function HeroCornerAccent() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 h-[min(220px,38vh)] w-[min(300px,72vw)] opacity-[0.14] sm:h-[min(260px,42vh)] sm:w-[min(340px,58vw)] sm:opacity-[0.12] md:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 0% 0%, black 0%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 0% 0%, black 0%, transparent 68%)",
        }}
      />
      <div className="absolute -left-[15%] -top-[12%] h-[min(50vh,380px)] w-[min(65vw,360px)] rounded-full bg-zinc-300/[0.07] blur-3xl mix-blend-overlay" />
    </div>
  );
}
