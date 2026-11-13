"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import { api, formatDate } from "@/lib/api";

function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    api("/borrows", { auth: true })
      .then(setBorrows)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (b) => {
    setReturningId(b._id);
    try {
      await api(`/borrows/${b._id}`, { method: "DELETE", auth: true });
      setBorrows((list) => list.filter((x) => x._id !== b._id));
      toast.success(`"${b.bookTitle}" returned. Thank you!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReturningId(null);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="mb-10 text-center">
        <p className="section-kicker">Currently reading</p>
        <h1 className="section-title mt-2">My Borrows</h1>
      </div>

      {loading ? (
        <Spinner label="Loading your borrowed books..." />
      ) : borrows.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 py-16 text-center">
          <p className="section-sub">You have not borrowed any books right now.</p>
          <Link href="/books" className="btn btn-primary mt-4">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img src={b.bookImage} alt="" className="h-16 w-12 rounded object-cover" />
                  </td>
                  <td className="font-bold">
                    <Link href={`/books/${b.bookId}`} className="hover:text-primary">
                      {b.bookTitle}
                    </Link>
                  </td>
                  <td>{formatDate(b.borrowDate)}</td>
                  <td>{formatDate(b.returnDate)}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleReturn(b)}
                      disabled={returningId === b._id}
                      className="btn btn-sm btn-secondary"
                    >
                      {returningId === b._id ? <span className="loading loading-spinner loading-xs" /> : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <MyBorrows />
    </PrivateRoute>
  );
}
