"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

type Module = {
  title: string;
  lessons: string[];
};

export default function ModuleAccordion({ modules }: { modules: Module[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 mb-8">
      {modules.map((mod, i) => {
        const open = openIndex === i;

        return (
          <div
            key={mod.title}
            className="rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-md overflow-hidden shadow-xl"
          >
            {/* Header */}
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full cursor-pointer flex items-center justify-between p-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div>
                  <div className="font-semibold">{mod.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {mod.lessons.length.toLocaleString("bn-BD")} টি লেসন
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t bg-white/5"
                >
                  <ul className="p-5 space-y-3">
                    {mod.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
