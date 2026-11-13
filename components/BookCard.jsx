import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function BookCard({ book, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.07} className="h-full">
      <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <figure>
          <img src={book.image} alt={`Cover of ${book.title}`} className="cover" loading="lazy" />
        </figure>
        <div className="card-body gap-1 p-5">
          <span className="badge badge-secondary badge-outline badge-sm">{book.category}</span>
          <h3 className="line-clamp-1 font-display text-xl font-bold" title={book.title}>
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm section-sub">by {book.author}</p>
          <div className="card-actions mt-auto pt-3">
            <Link href={`/books/${book._id}`} className="btn btn-primary btn-block">
              View Details
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
