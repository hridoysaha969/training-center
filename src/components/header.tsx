import { ArrowRight, Check, Dot, Sparkles } from "lucide-react";
import Image from "next/image";
import HeroBlocks from "./hero-blocks";

export default function Header() {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="layout py-20 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <h1 className="text-3xl/tight xl:text-4xl/tight capitalize font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              দক্ষতা অর্জনের নির্ভরযোগ্য <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                কম্পিউটার ট্রেনিং সেন্টার
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm lg:text-lg text-slate-600 dark:text-slate-400">
              শুরু থেকে অ্যাডভান্সড পর্যন্ত বাস্তবভিত্তিক কম্পিউটার প্রশিক্ষণ
              নিন অভিজ্ঞ প্রশিক্ষকের মাধ্যমে। ক্যারিয়ার গড়ার জন্য প্রয়োজনীয়
              স্কিল শিখুন আত্মবিশ্বাসের সাথে।
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="flex items-center gap-1 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
              >
                আমাদের কোর্স ‍সমূহ
                <span>
                  <ArrowRight className=" h-4 w-4" />
                </span>
              </a>
            </div>

            {/* Small trust line */}
            <p className="mt-6 flex flex-col lg:flex-row gap-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> অভিজ্ঞ প্রশিক্ষক
                <Dot className="w-5 h-5 hidden lg:block text-zinc-600 dark:text-zinc-300" />
              </span>
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> হাতে-কলমে প্রশিক্ষণ{" "}
                <Dot className="w-5 h-5 hidden lg:block text-zinc-600 dark:text-zinc-300" />
              </span>
              <span className="flex items-center gap-0.5">
                <Check className="w-5 h-5 text-green-400" /> ক্যারিয়ার-ফোকাসড
                কোর্স
              </span>
            </p>
          </div>

          {/* Right visual */}
          <HeroBlocks />
        </div>
      </div>
    </section>
  );
}
