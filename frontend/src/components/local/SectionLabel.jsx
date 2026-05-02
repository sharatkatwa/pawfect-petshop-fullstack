export default function SectionLabel({ eyebrow, title, action }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="inline-block border-b-[4px] border-[var(--chart-1)] pb-1 font-heading text-xs uppercase tracking-[0.18em] text-foreground">
          {eyebrow}
        </p>
        {title ? (
          <h2 className="mt-3 font-heading text-3xl uppercase leading-none text-foreground sm:text-4xl">
            {title}
          </h2>
        ) : null}
      </div>
      {action}
    </div>
  );
}