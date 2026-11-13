import Link from "next/link";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import Logo from "@/components/Logo";

const socials = [
  { href: "https://x.com", label: "X", Icon: FaXTwitter },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
  { href: "https://github.com", label: "GitHub", Icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed opacity-80">
            A small online library where you add a book, borrow a book and return a book. Simple as that.
          </p>
          <div className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="btn btn-circle btn-sm border-neutral-content/30 bg-transparent text-neutral-content hover:bg-secondary hover:text-secondary-content"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/" className="hover:text-accent">Home</Link></li>
            <li><Link href="/books" className="hover:text-accent">All Books</Link></li>
            <li><Link href="/add-book" className="hover:text-accent">Add Book</Link></li>
            <li><Link href="/my-borrows" className="hover:text-accent">My Borrows</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Contact</h3>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2"><MdEmail /> hello@booknook.app</li>
            <li className="flex items-center gap-2"><MdPhone /> +880 1700 000000</li>
            <li className="flex items-center gap-2"><MdLocationOn /> 12 Library Lane, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-content/15 py-4 text-center text-xs opacity-70">
        &copy; {new Date().getFullYear()} BookNook. All rights reserved.
      </div>
    </footer>
  );
}
