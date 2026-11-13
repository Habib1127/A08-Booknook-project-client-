"use client";

import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import BookForm from "@/components/BookForm";
import { useSession } from "@/lib/auth-client";

function AddBook() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="mb-8 text-center">
        <p className="section-kicker">Share a book</p>
        <h1 className="section-title mt-2">Add a Book</h1>
        <p className="section-sub mt-3">Add a book to the library so other readers can borrow it.</p>
      </div>
      <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <BookForm mode="add" user={session?.user} onDone={() => router.push("/my-books")} />
      </div>
    </section>
  );
}

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <AddBook />
    </PrivateRoute>
  );
}
