"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

function validatePassword(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters long.";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = form.get("password");

    const pwError = validatePassword(password);
    setPasswordError(pwError);
    if (pwError) {
      toast.error(pwError);
      return;
    }

    setLoading(true);
    const { error: err } = await authClient.signUp.email({
      name: form.get("name").trim(),
      email: form.get("email").trim(),
      image: form.get("photo").trim(),
      password,
    });
    setLoading(false);

    if (err) {
      const msg = /exist|already/i.test(err.message || "")
        ? "An account with this email already exists. Try logging in instead."
        : err.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Account created! Please log in to continue.");
    router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
  };

  const handleGoogle = async () => {
    const { error: err } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (err) toast.error("Google sign-in did not work. Please try again.");
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="section-title text-center">Create your account</h1>
        <p className="section-sub mt-2 text-center text-sm">Join BookNook and start borrowing today.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input name="name" type="text" required placeholder="Your full name" className="input input-bordered w-full" />
          </label>
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Photo URL</span>
            <input name="photo" type="url" required placeholder="https://example.com/my-photo.jpg" className="input input-bordered w-full" />
          </label>
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 6 chars, upper and lower case"
              className={`input input-bordered w-full ${passwordError ? "input-error" : ""}`}
              onChange={() => passwordError && setPasswordError("")}
            />
            {passwordError && <span className="mt-1 block text-sm text-error">{passwordError}</span>}
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Register"}
          </button>
        </form>

        <div className="divider my-6 text-xs">OR</div>

        <button onClick={handleGoogle} className="btn btn-outline btn-block gap-2">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
