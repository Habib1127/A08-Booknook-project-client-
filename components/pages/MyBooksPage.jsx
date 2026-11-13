"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import BookForm from "@/components/BookForm";
import { api } from "@/lib/api";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/books?mine=true", { auth: true })
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE", auth: true });
      setBooks((list) => list.filter((b) => b._id !== deleting._id));
      toast.success(`"${deleting.title}" was deleted.`);
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="section-kicker">Your shelf</p>
          <h1 className="section-title mt-2">My Books</h1>
        </div>
        <Link href="/add-book" className="btn btn-primary">
          Add a New Book
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading your books..." />
      ) : books.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 py-16 text-center">
          <p className="section-sub">You have not added any books yet.</p>
          <Link href="/add-book" className="btn btn-primary mt-4">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Copies</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={b.image} alt="" className="h-16 w-12 rounded object-cover" />
                      <div>
                        <Link href={`/books/${b._id}`} className="font-bold hover:text-primary">
                          {b.title}
                        </Link>
                        <p className="text-xs opacity-70">{b.author}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary badge-outline">{b.category}</span>
                  </td>
                  <td>
                    {b.copies} / {b.totalCopies}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(b)} className="btn btn-sm btn-outline btn-primary gap-2">
                        <FaPenToSquare /> Edit
                      </button>
                      <button onClick={() => setDeleting(b)} className="btn btn-sm btn-outline btn-error gap-2">
                        <FaTrashCan /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit book" wide>
        {editing && (
          <BookForm
            key={editing._id}
            mode="edit"
            book={editing}
            onCancel={() => setEditing(null)}
            onDone={(saved) => {
              setBooks((list) => list.map((b) => (b._id === saved._id ? saved : b)));
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <Modal open={!!deleting} onClose={() => !busy && setDeleting(null)} title="Delete this book?">
        <p className="section-sub">
          <strong className="text-base-content">{deleting?.title}</strong> will be removed from the library for good,
          along with any active borrow records. This cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setDeleting(null)} disabled={busy}>
            Keep it
          </button>
          <button className="btn btn-error" onClick={confirmDelete} disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : "Yes, delete"}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <MyBooks />
    </PrivateRoute>
  );
}
