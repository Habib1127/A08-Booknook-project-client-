import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "BookNook | A Small Online Library",
  description: "Add a book, borrow a book, return a book. BookNook is a small online library for everyone.",
};

// Runs before paint so the saved theme never flashes.
const themeScript = `
try {
  var t = localStorage.getItem('booknook-theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'booknook-night' : 'booknook';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="booknook" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { background: "var(--color-base-100)", color: "var(--color-base-content)", border: "1px solid var(--color-base-300)" },
          }}
        />
      </body>
    </html>
  );
}
