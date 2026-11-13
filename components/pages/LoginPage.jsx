"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

const safePath = (p) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safePath(params.get("redirect"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { error: err } = await authClient.signIn.email({
      email: form.get("email").trim(),
      password: form.get("password"),
    });
    setLoading(false);

    if (err) {
      const msg = "Wrong email or password. Please check your details and try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Welcome back to BookNook!");
    router.replace(redirect);
    router.refresh();
  };

  const handleGoogle = async () => {
    const { error: err } = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    if (err) toast.error("Google sign-in did not work. Please try again.");
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="section-title text-center">Login to BookNook</h1>
        <p className="section-sub mt-2 text-center text-sm">Pick up right where you left off.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="form-control w-full">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input input-bordered w-full" />
          </label>

          <div className="text-right">
            <button
              type="button"
              onClick={() => toast("Password reset is coming soon. For now, please contact support.", { icon: "🔑" })}
              className="link link-hover text-sm text-primary"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Login"}
          </button>
        </form>

        <div className="divider my-6 text-xs">OR</div>

        <button onClick={handleGoogle} className="btn btn-outline btn-block gap-2">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm">
          New to BookNook?{" "}
          <Link href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="link link-primary font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
