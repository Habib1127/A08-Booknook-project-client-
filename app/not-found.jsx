import Link from "next/link";

export const metadata = { title: "BookNook | Page Not Found" };

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl font-bold text-secondary">404</p>
      <h1 className="section-title mt-2">This page is missing from our shelves</h1>
      <p className="section-sub mt-3">
        The page you are looking for may have been moved, returned, or never added to the library.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  );
}
