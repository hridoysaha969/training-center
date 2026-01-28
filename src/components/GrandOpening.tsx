"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function GrandOpeningBanner() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-purple-600/10" />

      {/* Animated glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.3, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/20 blur-3xl"
      />

      <div className="layout">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg md:p-12"
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Left content */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white">
                <Sparkles size={16} className="text-yellow-300" />
                Grand Opening Offer
              </span>

              <h3 className="mt-6 md:text-3xl text-xl font-bold text-white sm:text-4xl">
                Up to{" "}
                <span className="text-yellow-300 text-3xl">30% Discount</span>{" "}
                on All Courses
              </h3>

              <p className="mt-4 max-w-xl text-white/90">
                Celebrate our grand opening with limited-time discounts. Enroll
                now and start your journey toward a better career.
              </p>
            </div>

            {/* Right content */}
            <div className="flex flex-col items-start gap-4 md:items-end">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:gap-3 hover:bg-slate-100"
              >
                Enroll Now
                <ArrowRight size={18} />
              </a>

              <p className="text-sm text-white/80">
                Offer valid for a limited time only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
