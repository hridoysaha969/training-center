import CourseCard from "@/components/CourseCard";
import Title from "@/components/title";
import { courses } from "@/data/cources";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const page = async () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <Title
          title="আমাদের কোর্সসমূহ"
          subtitle="অভিজ্ঞ ট্রেইনারদের মাধ্যমে হাতে-কলমে শেখার সুযোগ — বাস্তব কাজের জন্য প্রস্তুত কোর্সসমূহ"
        />

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default page;
