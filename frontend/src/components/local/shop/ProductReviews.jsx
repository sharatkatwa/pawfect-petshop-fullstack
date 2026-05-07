function ReviewCard({ title, body, author }) {
  return (
    <article className="border-[4px] border-border bg-secondary-background p-7 shadow-shadow">
      <p className="font-heading text-3xl leading-none" aria-label="5 star review">
        ☆ ☆ ☆ ☆ ☆
      </p>
      <h3 className="mt-4 font-heading text-sm font-black uppercase">{title}</h3>
      <p className="mt-4 text-base leading-7">{body}</p>
      <p className="mt-6 font-heading text-sm uppercase">- {author}</p>
    </article>
  );
}

export default function ProductReviews({ reviews }) {
  return (
    <section className="border-t-[4px] border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
        <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
          What the pack says
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={`${review.title}-${review.author}`} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
