"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookMedical, FaBookOpenReader, FaRotateLeft, FaFlask, FaLandmark, FaChild, FaFeatherPointed, FaShapes, FaQuoteLeft } from "react-icons/fa6";
import { api } from "@/lib/api";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import Reveal from "@/components/Reveal";

const slides = [
  {
    title: "Your next favourite story is on the shelf",
    text: "Browse books added by readers like you and borrow one for a week, free.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80",
  },
  {
    title: "Got a book gathering dust? Share it",
    text: "Add your book to the library and let other readers enjoy it too.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80",
  },
  {
    title: "Borrow today, return when you are done",
    text: "Seven days per book, tracked for you in My Borrows. No late-fee drama.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80",
  },
];

const steps = [
  { Icon: FaBookMedical, title: "Add a book", text: "Share a book from your shelf with a cover, a short description and the number of copies." },
  { Icon: FaBookOpenReader, title: "Borrow a book", text: "Pick any available title and confirm. You get it for seven days." },
  { Icon: FaRotateLeft, title: "Return a book", text: "Finished reading? Return it from My Borrows so the next reader can enjoy it." },
];

const categories = [
  { name: "Fiction", Icon: FaFeatherPointed, text: "Novels and stories" },
  { name: "Science", Icon: FaFlask, text: "Ideas that explain the world" },
  { name: "History", Icon: FaLandmark, text: "People and past events" },
  { name: "Kids", Icon: FaChild, text: "Picture books and tales" },
  { name: "Others", Icon: FaShapes, text: "Everything in between" },
];

const reviews = [
  { name: "Nusrat J.", text: "I borrowed three books in my first month. The return reminder in My Borrows keeps me honest." },
  { name: "Tanvir A.", text: "Adding my old textbooks took two minutes, and now other students use them." },
  { name: "Mehnaz R.", text: "Clean, quick and easy. It feels like a tiny neighbourhood library in my pocket." },
];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/books?sort=latest&limit=6")
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="h-[70vh] min-h-[460px]"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className="relative h-full w-full">
                <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f2f26]/90 via-[#0f2f26]/60 to-transparent" />
                <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10">
                  <div className="max-w-xl text-[#fffdf8]">
                    <p className="section-kicker !text-accent">BookNook Library</p>
                    <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{s.title}</h1>
                    <p className="mt-4 text-base leading-relaxed opacity-90 sm:text-lg">{s.text}</p>
                    <Link href="/books" className="btn btn-secondary mt-7">
                      Browse Books
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal className="mb-10 text-center">
          <p className="section-kicker">Fresh on the shelf</p>
          <h2 className="section-title mt-2">New Arrivals</h2>
          <p className="section-sub mx-auto mt-3 max-w-xl">The six most recently added books, newest first.</p>
        </Reveal>

        {loading ? (
          <Spinner label="Loading new arrivals..." />
        ) : books.length === 0 ? (
          <p className="py-10 text-center section-sub">No books yet. Be the first to add one!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => (
              <BookCard key={b._id} book={b} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/books" className="btn btn-primary btn-wide">
            See All Books
          </Link>
        </div>
      </section>

      {/* How borrowing works */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <Reveal className="mb-10 text-center">
          <p className="section-kicker">Simple as 1-2-3</p>
          <h2 className="section-title mt-2">How Borrowing Works</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1} className="h-full">
              <div className="relative h-full rounded-box border border-base-300 bg-base-200 p-7">
                <span className="absolute right-5 top-4 font-display text-5xl font-bold text-base-300">{i + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-xl text-primary-content">
                  <Icon />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed section-sub">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Top categories */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <Reveal className="mb-10 text-center">
          <p className="section-kicker">Find your genre</p>
          <h2 className="section-title mt-2">Top Categories</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ name, Icon, text }, i) => (
            <Reveal key={name} delay={i * 0.06} className="h-full">
              <motion.div whileHover={{ y: -4 }} className="h-full">
                <Link
                  href={`/books?category=${name}`}
                  className="flex h-full flex-col items-center rounded-box border border-base-300 bg-base-100 p-6 text-center transition hover:border-primary hover:shadow-md"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary/15 text-2xl text-secondary">
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{name}</h3>
                  <p className="mt-1 text-xs section-sub">{text}</p>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reader reviews */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <Reveal className="mb-10 text-center">
          <p className="section-kicker">Kind words</p>
          <h2 className="section-title mt-2">Reader Reviews</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1} className="h-full">
              <figure className="h-full rounded-box border border-base-300 bg-base-200 p-7">
                <FaQuoteLeft className="text-2xl text-accent" />
                <blockquote className="mt-4 leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-primary">{r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
