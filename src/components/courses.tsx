"use client";

import { courses } from "@/data/cources";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import Title from "./title";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Courses() {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Title
            title="আমাদের কোর্সসমূহ"
            subtitle="অভিজ্ঞ ট্রেইনারদের মাধ্যমে হাতে-কলমে শেখার সুযোগ — বাস্তব কাজের জন্য প্রস্তুত কোর্সসমূহ"
          />
        </motion.div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {courses.slice(0, 2).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-12 text-center flex items-center justify-center w-full">
          <Link
            href="/courses"
            className="text-sm flex items-center gap-1 font-semibold transition text-blue-500 hover:text-blue-600"
          >
            সকল কোর্স দেখুন <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
