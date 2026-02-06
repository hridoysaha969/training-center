import { Course } from "@/data/cources";
import { ArrowRight, Award, Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl sm:p-8 p-4 shadow-2xl space-y-2">
      {/* Accent Rail */}
      <div className={`w-1 rounded-full bg-${course.accent}-500`} aria-hidden />

      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {course.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.subtitle}
            </p>
          </div>

          {/* Level Badge */}

          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
            {course.level}
          </span>
        </div>

        {/* Duration & Class Type */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-xl bg-blue-100 text-blue-700 px-2 py-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {course.duration}
          </span>
          {course.classType.map((type) => (
            <span key={type} className="rounded-xl bg-muted px-2 py-1">
              {type}
            </span>
          ))}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Outcomes */}
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {course.outcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="flex flex-col items-start gap-0 pt-2">
          <span className="text-xs text-muted-foreground">কোর্স ফি</span>
          {course.offerPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">
                ৳{course.offerPrice.toLocaleString("bn-BD")}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ৳{course.regularPrice.toLocaleString("bn-BD")}
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-foreground">
              ৳{course.regularPrice.toLocaleString("bn-BD")}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-start justify-between gap-3 pt-2">
          <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
            <Award size={16} /> কোর্স শেষে সার্টিফিকেট
          </span>

          <Button
            asChild
            className="bg-blue-600 text-white transition hover:bg-blue-700 rounded-full"
          >
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex cursor-pointer bg-blue-600 text-white transition hover:bg-blue-700 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              বিস্তারিত দেখুন <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {/* Target Group */}
        <p className="text-xs text-muted-foreground">
          উপযোগী: {course.targetGroup}
        </p>
      </div>
    </div>
  );
}
