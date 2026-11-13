import { Suspense } from "react";
import AllBooksPage from "@/components/pages/AllBooksPage";
import Spinner from "@/components/Spinner";

export const metadata = { title: "BookNook | All Books" };

export default function Page() {
  return (
    <Suspense fallback={<Spinner full />}>
      <AllBooksPage />
    </Suspense>
  );
}
