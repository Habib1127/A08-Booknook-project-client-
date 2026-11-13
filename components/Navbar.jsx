"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa6";
import { signOut, useSession } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;
  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been logged out.");
      router.push("/");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  const navItems = links.map((l) => (
    <li key={l.href}>
      <Link
        href={l.href}
        className={`font-medium ${isActive(l.href) ? "text-primary underline underline-offset-8 decoration-2" : ""}`}
      >
        {l.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost btn-circle lg:hidden" aria-label="Open menu">
              <FaBars />
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {navItems}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{navItems}</ul>
        </div>

        <div className="navbar-end gap-1">
          <ThemeToggle />
          {isPending ? (
            <span className="loading loading-spinner loading-sm text-primary" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar" aria-label="Open profile menu">
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1f5c4a&color=fff`}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="menu-title px-3 py-2">
                  <span className="block font-semibold text-base-content">{user.name}</span>
                  <span className="block truncate text-xs font-normal">{user.email}</span>
                </li>
                <li>
                  <Link href="/profile">My Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-primary btn-sm sm:btn-md">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
