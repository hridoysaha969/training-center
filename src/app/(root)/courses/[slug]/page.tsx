import CourseProgressDemo from "@/components/CourseProgressDemo";
import ModuleAccordion from "@/components/ModuleAccordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/cources";
import { CheckCircle, Clock, Users } from "lucide-react";

export default async function CourseDetails({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  const course = courses.find((c) => c.id === slug);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="relative overflow-hidden flex flex-col lg:flex-row md:items-center items-start justify-center bg-white dark:bg-zinc-950 py-6 md:py-12">
      {/* Colorful Blurry Background Blob */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-linear-to-tr from-purple-300 via-white to-green-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-50 rounded-full blur-3xl animate-pulse z-0" />

      {/* Optional Duplicate Blobs for Depth */}
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-linear-to-br from-fuchsia-200 via-transparent to-cyan-300 dark:from-fuchsia-700 dark:via-transparent dark:to-cyan-600 opacity-40 rounded-full blur-2xl z-0" />

      {/* ================= HERO ================= */}
      <div className="layout z-10 mt-20">
        <section className="grid lg:grid-cols-2 gap-10 items-center mb-12">
          <div>
            <Badge className="mb-4 rounded-full px-4 py-1 bg-blue-100 text-blue-700">
              ভর্তি চলছে
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold my-4">
              {course.title}
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground mb-6">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Badge variant="secondary">
                <Clock className="w-4 h-4 mr-1" />
                সময়: {course.duration}
              </Badge>
              <Badge variant="secondary">লেভেল: {course.level}</Badge>
              <Badge variant="secondary">
                <Users className="w-4 h-4 mr-1" />
                {course.students}
              </Badge>
            </div>

            {/* <Button
              size="lg"
              className="rounded-full bg-blue-500 hover:bg-blue-700"
            >
              এখনই ভর্তি হন
            </Button> */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-foreground">
                ৳{course.offerPrice?.toLocaleString("bn-BD")}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ৳{course.regularPrice.toLocaleString("bn-BD")}
              </span>
            </div>
          </div>

          {/* Right Glass Visual */}
          <Card className="rounded-3xl backdrop-blur-xl bg-white/10 border shadow-2xl">
            <CardContent className="p-8 space-y-4">
              <div className="text-sm text-muted-foreground">কোর্স হাইলাইট</div>

              {course.highlights.map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* ================= LEARNING OUTCOMES ================= */}

        <section className="mb-16 space-y-10">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              আপনি যা শিখবেন
            </h2>
            <p className="text-muted-foreground">
              বাস্তব কাজের জন্য প্রয়োজনীয় দক্ষতা — হাতে-কলমে প্রশিক্ষণের মাধ্যমে
            </p>

            <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-purple-500" />
          </div>

          {/* Outcomes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {course.learningOutcomes.map((item) => (
              <Card
                key={item}
                className="group rounded-2xl border border-border bg-background/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex gap-4 p-6">
                  {/* Icon circle */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-relaxed text-foreground">
                    {item}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= MODULES ================= */}

        <div className="pb-8">
          <h2 className="text-3xl font-bold mb-3">কোর্স মডিউল</h2>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 lg:col-span-1">
              <ModuleAccordion modules={course.modules} />
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <CourseProgressDemo />
            </div>
          </div>
        </div>

        {/* ================= FINAL CTA ================= */}

        <section className="rounded-3xl border p-10 text-center space-y-4">
          <h3 className="text-2xl font-bold">
            সিট সীমিত — আজই ভর্তি সম্পন্ন করুন
          </h3>
          <Button size="lg" className="rounded-2xl">
            ভর্তি ফর্ম পূরণ করুন
          </Button>
        </section>
      </div>
    </div>
  );
}
