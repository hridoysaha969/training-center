"use client";

import { motion } from "framer-motion";
import { Laptop, Palette, Code, TrendingUp, Database } from "lucide-react";

const courses = [
  {
    title: "Computer Office Application",
    duration: "3 Months",
    description:
      "MS Word, Excel, PowerPoint, internet usage, and office productivity tools.",
    icon: Laptop,
  },
  {
    title: "Graphic Design",
    duration: "4 Months",
    description:
      "Photoshop, Illustrator, branding basics, and real design projects.",
    icon: Palette,
  },
  {
    title: "Web Development",
    duration: "6 Months",
    description:
      "HTML, CSS, JavaScript, modern frameworks, and project-based learning.",
    icon: Code,
  },
  {
    title: "Digital Marketing",
    duration: "3 Months",
    description: "Social media marketing, ads, SEO basics, and analytics.",
    icon: TrendingUp,
  },
  {
    title: "Data Entry & Office Support",
    duration: "2 Months",
    description:
      "Data processing, documentation, and professional office skills.",
    icon: Database,
  },
];

export default function Courses() {
  return (
    <section id="courses" className="bg-slate-50 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Our Courses
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Industry-relevant courses designed to build practical skills.
          </p>
        </motion.div>

        {/* Course grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course, index) => {
            const Icon = course.icon;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {course.title}
                </h3>

                {/* Duration */}
                <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                  Duration: {course.duration}
                </p>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3 dark:text-blue-400"
                >
                  Learn More →
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
