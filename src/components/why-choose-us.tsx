"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, BadgeCheck, Clock, Headphones } from "lucide-react";

const reasons = [
  {
    title: "Experienced Instructors",
    description:
      "Learn from professionals with real industry experience, not just theory.",
    icon: Users,
  },
  {
    title: "Career-Focused Training",
    description:
      "Our courses are designed to prepare you for real jobs and freelancing.",
    icon: Briefcase,
  },
  {
    title: "Verified Certification",
    description:
      "Get certificates that matter and can be verified for authenticity.",
    icon: BadgeCheck,
  },
  {
    title: "Flexible Learning Time",
    description: "Morning and evening batches to fit your personal schedule.",
    icon: Clock,
  },
  {
    title: "Student Support",
    description: "Continuous guidance even after course completion.",
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-blue-100 via-transparent to-fuchsia-200 dark:from-blue-950 dark:to-purple-950" />

      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            What makes our training center different from the rest.
          </p>
        </motion.div>

        {/* Zig-zag grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            const offset =
              index % 2 === 0 ? "lg:translate-y-0" : "lg:translate-y-8";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 ${offset}`}
              >
                {/* Reason number */}
                <span className="absolute -top-4 right-4 text-6xl font-bold text-slate-200 dark:text-slate-800">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <Icon size={24} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
