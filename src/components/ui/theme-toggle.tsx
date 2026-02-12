"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

type Theme = "light" | "dark";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
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
    <button
      className="rounded-full cursor-pointer p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} onClick={() => handleChange("light")} />
      ) : (
        <Moon size={18} onClick={() => handleChange("dark")} />
      )}
    </button>
  );
};

export default ThemeToggle;
