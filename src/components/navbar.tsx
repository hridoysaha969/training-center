"use client";

import { cn } from "@/lib/cn";
import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "কোর্স মডিউল", href: "/courses" },
  { label: "ভর্তি তথ্য", href: "/admission" },
  { label: "যোগাযোগ", href: "/contact" },
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
              href="#contact"
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
          "fixed inset-0 z-50 transition",
          isOpen ? "visible" : "invisible",
        )}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 bg-white p-6 transition-transform dark:bg-zinc-900",
            isOpen ? "tranzinc-x-0" : "tranzinc-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-bold">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-zinc-700 transition hover:text-blue-600 dark:text-zinc-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              className="mt-6 rounded-full bg-blue-600 py-3 text-center font-semibold text-white"
            >
              Enroll Now
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
}
