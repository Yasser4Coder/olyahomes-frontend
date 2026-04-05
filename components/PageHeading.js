export default function PageHeading({ title, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-lg text-foreground/70">{subtitle}</p>
      ) : null}
    </div>
  );
}
