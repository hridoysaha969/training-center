import { Check, Dot } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="layout py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <h1 className="text-2xl lg:text-3xl/tight xl:text-5xl/tight capitalize font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              Build Your Career with <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                Practical Computer Skills
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm lg:text-lg text-slate-600 dark:text-slate-400">
              Learn industry-relevant computer skills through hands-on training,
              expert instructors, and verified certification.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
              >
                Get Admission
              </a>

              <a
                href="#courses"
                className="rounded-full border border-slate-300 px-8 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                View Courses
              </a>
            </div>

            {/* Small trust line */}
            <p className="mt-6 flex flex-col lg:flex-row gap-1 text-sm text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> Job-oriented
                training
                <Dot className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              </span>
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> Flexible batches{" "}
                <Dot className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              </span>
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> Trusted by students
              </span>
            </p>
          </div>

          {/* Right visual */}
          <div className="relative p-10 md:p-0">
            <div className="relative mx-auto h-60 w-[95%] md:h-90 md:w-full max-w-md rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white dark:bg-slate-900">
                <Image
                  src={"/hero.svg"}
                  alt="Excel Computer Hero Image"
                  width={400}
                  height={400}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-6 left-2 md:left-3 lg:-left-6 rounded-xl bg-white px-6 py-4 shadow-xl dark:bg-slate-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                1200+
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Students Trained
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
