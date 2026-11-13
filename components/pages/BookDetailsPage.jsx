"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import { api, formatDate } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

function BookDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/books/${id}`, { auth: true })
      .then(setBook)
      .catch((e) => {
        setNotFound(true);
        toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }
    setBusy(true);
    try {
      const borrow = await api("/borrows", { method: "POST", body: { bookId: id }, auth: true });
      setBook((b) => ({ ...b, copies: b.copies - 1 }));
      setOpen(false);
      toast.success(`Enjoy your read! Please return it by ${formatDate(borrow.returnDate)}.`);
    } catch (err) {
      setOpen(false);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner full label="Loading book details..." />;
  if (notFound || !book)
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="section-title">We could not find that book</h1>
        <Link href="/books" className="btn btn-primary mt-6">
          Back to All Books
        </Link>
      </section>
    );

  const available = book.copies > 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <Link href="/books" className="link link-hover text-sm text-primary">
        &larr; Back to all books
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[320px_1fr]">
        <img src={book.image} alt={`Cover of ${book.title}`} className="cover rounded-box shadow-lg" />

        <div>
          <span className="badge badge-secondary badge-outline">{book.category}</span>
          <h1 className="section-title mt-3">{book.title}</h1>
          <p className="mt-1 text-lg section-sub">by {book.author}</p>

          <p className="mt-6 leading-relaxed">{book.description}</p>

          <dl className="mt-6 grid gap-3 rounded-box border border-base-300 bg-base-200 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-primary">Added by</dt>
              <dd>{book.ownerName}</dd>
              <dd className="text-xs opacity-70">{book.ownerEmail}</dd>
            </div>
            <div>
              <dt className="font-bold text-primary">Added on</dt>
              <dd>{formatDate(book.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-bold text-primary">Available copies</dt>
              <dd>
                {book.copies} of {book.totalCopies}
              </dd>
            </div>
          </dl>

          <button
            onClick={() => setOpen(true)}
            disabled={!available}
            className="btn btn-primary btn-lg mt-8 w-full sm:w-auto"
          >
            {available ? "Borrow This Book" : "Not Available"}
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => !busy && setOpen(false)} title="Borrow this book">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-base-200 p-3">
          <img src={book.image} alt="" className="h-16 w-12 rounded object-cover" />
          <div>
            <p className="font-bold">{book.title}</p>
            <p className="text-xs opacity-70">You can keep it for 7 days.</p>
          </div>
        </div>
        <div className="space-y-3">
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Your Name</span>
            <input value={user?.name || ""} readOnly className="input input-bordered w-full bg-base-200" />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Your Email</span>
            <input value={user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
          </label>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleBorrow} disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : "Confirm Borrow"}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default function BookDetailsPage() {
  return (
    <PrivateRoute>
      <BookDetails />
    </PrivateRoute>
  );
}
