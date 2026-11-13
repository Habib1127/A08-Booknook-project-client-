import { Suspense } from "react";
import LoginPage from "@/components/pages/LoginPage";
import Spinner from "@/components/Spinner";

export const metadata = { title: "BookNook | Login" };

export default function Page() {
  return (
    <Suspense fallback={<Spinner full />}>
      <LoginPage />
    </Suspense>
  );
}
