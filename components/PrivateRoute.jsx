"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

/**
 * Wraps private pages. While the session is being restored (e.g. on reload)
 * we show a spinner instead of redirecting, so a logged in user is never
 * bounced to /login. Guests are sent to /login and come back after signing in.
 */
export default function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, router, pathname]);

  if (isPending || !session) return <Spinner full label="Checking your session..." />;
  return children;
}
