"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { api, CATEGORIES } from "@/lib/api";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";

export default function AllBooksPage() {
  const params = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(params.get("category") || "All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/books")
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter(
      (b) =>
        (category === "All" || b.category === category) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
  }, [books, category, search]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-10 text-center">
        <p className="section-kicker">The whole collection</p>
        <h1 className="section-title mt-2">All Books</h1>
        <p className="section-sub mx-auto mt-3 max-w-xl">Every book in the library. Pick one and borrow it for seven days.</p>
      </div>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? "btn-primary" : "btn-outline"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author"
          className="input input-bordered w-full md:max-w-xs"
          aria-label="Search books"
        />
      </div>

      {loading ? (
        <Spinner label="Loading books..." />
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center section-sub">No books match your search yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <BookCard key={b._id} book={b} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
