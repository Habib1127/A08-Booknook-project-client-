import Link from "next/link";
import { FaBookOpen } from "react-icons/fa6";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="BookNook home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-content">
        <FaBookOpen />
      </span>
      <span className={`font-display text-2xl font-bold ${light ? "text-neutral-content" : ""}`}>
        Book<span className="text-secondary">Nook</span>
      </span>
    </Link>
  );
}
