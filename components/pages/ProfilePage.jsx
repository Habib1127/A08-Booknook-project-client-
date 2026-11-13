"use client";

import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import { useSession } from "@/lib/auth-client";

function Profile() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className="mx-auto max-w-lg px-4 py-14">
      <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-lg">
        <div className="avatar">
          <div className="w-28 rounded-full ring ring-primary ring-offset-4 ring-offset-base-100">
            <img
              src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "B")}&background=1f5c4a&color=fff`}
              alt={user?.name}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="section-title mt-5">{user?.name}</h1>
        <p className="section-sub mt-1">{user?.email}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link href="/my-books" className="btn btn-outline btn-primary">
            My Books
          </Link>
          <Link href="/my-borrows" className="btn btn-outline btn-secondary">
            My Borrows
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}
