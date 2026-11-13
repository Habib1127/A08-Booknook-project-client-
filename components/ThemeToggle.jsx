"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const LIGHT = "booknook";
const DARK = "booknook-night";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(LIGHT);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || LIGHT);
  }, []);

  const toggle = () => {
    const next = theme === DARK ? LIGHT : DARK;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("booknook-theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-circle"
      aria-label={theme === DARK ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
    >
      {theme === DARK ? <FaSun className="text-accent" /> : <FaMoon />}
    </button>
  );
}
