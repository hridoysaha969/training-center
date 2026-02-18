"use client";

import { cn } from "@/lib/cn";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DiscountPopup from "./discount";

const navItems = [
  { label: "হোম", href: "/" },
  { label: "কোর্স মডিউল", href: "/courses" },
  { label: "আমাদের সম্পর্কে", href: "/about-us" },
  // { label: "যোগাযোগ", href: "/contact" },
];

type Theme = "light" | "dark";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const root = document.documentElement;
    const storedPreference = localStorage.getItem("theme") as Theme | null;

    const isDarkPreferred: boolean =
      storedPreference === "dark" ||
      (!storedPreference &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkPreferred);
    root.classList.toggle("dark", isDarkPreferred);
  }, []);

  // Handler to change theme
  const handleChange = (theme: Theme) => {
    const root = document.documentElement;
    const isDarkMood = theme === "dark";

    setIsDark(isDarkMood);
    root.classList.toggle("dark", !isDark); // corrected
    localStorage.setItem("theme", theme);

    console.log(isDark);
  };

  return (
    <>
      <DiscountPopup />
      {/* Navbar */}
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "backdrop-blur bg-white/80 dark:bg-zinc-900 shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="flex h-18 layout items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex text-2xl items-center gap-2 font-bold select-none"
          >
            <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Excel Computer
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-zinc-700 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 -tranzinc-x-1/2 bg-blue-600 transition-all group-hover:w-full" />
              </a>
            ))}

            {/* Theme toggle */}
            <button
              className="rounded-full cursor-pointer p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon size={18} onClick={() => handleChange("light")} />
              ) : (
                <Sun size={18} onClick={() => handleChange("dark")} />
              )}
            </button>

            {/* CTA */}
            <Link
              href="/admission"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ভর্তি নিন
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              {isDark ? (
                <Moon size={18} onClick={() => handleChange("light")} />
              ) : (
                <Sun size={18} onClick={() => handleChange("dark")} />
              )}
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <aside
        className={cn(
          "fixed inset-0 z-50",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 dark:bg-zinc-900/80",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-semibold tracking-wide">তালিকা</span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group relative overflow-hidden rounded-xl border border-transparent px-4 py-3 text-base font-medium text-zinc-700 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-950/40"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 z-0 translate-y-full bg-linear-to-r from-blue-500/10 to-purple-500/10 transition-transform duration-300 group-hover:translate-y-0" />
              </a>
            ))}

            {/* CTA */}
            <a
              href="/admission"
              onClick={() => setIsOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              ভর্তি নিন
            </a>
          </nav>

          {/* Bottom subtle info */}
          <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Excel Computer & IT Center
          </p>
        </div>
      </aside>
    </>
  );
}
