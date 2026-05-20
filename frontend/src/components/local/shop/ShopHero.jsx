export default function ShopHero() {
  return (
    <section className="mx-auto max-w-[1220px] px-5 pt-28 md:px-8 hover:rotate-1 transition-all">
      <div className="rotate-[-1deg] border-[4px] border-border bg-main px-7 py-10 shadow-[8px_8px_0_0_var(--border)] md:px-11 md:py-14">
        <h1 className="max-w-5xl -skew-x-12 font-heading text-4xl font-black uppercase italic leading-none tracking-normal text-foreground sm:text-6xl lg:text-7xl">
          Shop the underground
        </h1>
        <p className="mt-5 inline-block bg-foreground px-4 py-1 font-heading text-base font-black uppercase leading-none text-secondary-background sm:text-2xl">
          Streetwear for the four-legged rebels.
        </p>
      </div>
    </section>
  );
}
