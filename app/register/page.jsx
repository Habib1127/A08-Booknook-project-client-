import { Suspense } from "react";
import RegisterPage from "@/components/pages/RegisterPage";
import Spinner from "@/components/Spinner";

export const metadata = { title: "BookNook | Register" };

export default function Page() {
  return (
    <Suspense fallback={<Spinner full />}>
      <RegisterPage />
    </Suspense>
  );
}
