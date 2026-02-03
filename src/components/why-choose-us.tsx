"use client";

import {
  ChartNoAxesCombined,
  Award,
  Trophy,
  LucideBrush,
  LucideGlobe,
  LucideBadgePercent,
  LucideWand2,
  Briefcase,
  BadgeCheck,
  GraduationCap,
  FileSpreadsheet,
  Keyboard,
} from "lucide-react";
import Title from "./title";
import Card from "./card";

type RadialProgressProps = {
  value: number;
};

const RadialProgress = ({ value }: RadialProgressProps) => (
  <div className="relative w-16 h-16">
    <svg className="w-full h-full -rotate-90">
      <circle
        cx="50%"
        cy="50%"
        r="24"
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="50%"
        cy="50%"
        r="24"
        stroke="#3b82f6"
        strokeWidth="8"
        fill="none"
        strokeDasharray={2 * Math.PI * 24}
        strokeDashoffset={2 * Math.PI * 24 * (1 - value / 100)}
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
      {value}%
    </div>
  </div>
);

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden flex flex-col lg:flex-row md:items-center items-start justify-center bg-white dark:bg-zinc-950 py-6 md:py-12">
      {/* Colorful Blurry Background Blob */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-linear-to-tr from-purple-300 via-white to-green-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-50 rounded-full blur-3xl animate-pulse z-0" />

      {/* Optional Duplicate Blobs for Depth */}
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-linear-to-br from-fuchsia-200 via-transparent to-cyan-300 dark:from-fuchsia-700 dark:via-transparent dark:to-cyan-600 opacity-40 rounded-full blur-2xl z-0" />

      <div className="layout">
        {/* Header */}
        <Title
          title="কেন আমাদের নির্বাচন করবেন"
          subtitle="আমাদের প্রশিক্ষণ কেন্দ্রকে অন্যদের থেকে আলাদা করে যে বিষয়গুলো।"
        />

        {/* layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ================= LEFT — SPOTLIGHT GLASS DASHBOARD ================= */}

          <div className="relative py-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl sm:p-8 p-4 shadow-2xl space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  হাতে-কলমে বাস্তব প্রশিক্ষণ
                </h3>
                <p className="opacity-80 text-sm">
                  প্রতিটি ক্লাসে সরাসরি কম্পিউটারে কাজের মাধ্যমে শেখানো হয়।
                  থিওরি নয় — বাস্তব প্রয়োগে দক্ষতা তৈরি।
                </p>
              </div>

              {/* mock progress UI */}
              <div className="space-y-4">
                <div className="relative w-full sm:h-65 h-110">
                  {/* Left rotated */}
                  <ValueChip
                    icon={ChartNoAxesCombined}
                    title="প্রমাণিত ফলাফল"
                    subtitle="উচ্চ সফলতার বাস্তব রেকর্ড"
                    className="absolute sm:top-10 top-24 sm:left-0 left-0 -rotate-8"
                  />

                  {/* Right rotated */}
                  <ValueChip
                    icon={Award}
                    title="মানসম্মত প্রশিক্ষণ"
                    subtitle="স্ট্রাকচার্ড ও আপডেট কোর্স"
                    className="absolute sm:top-0 top-0 sm:right-0 right-0 rotate-6"
                  />

                  {/* Center front */}
                  <ValueChip
                    icon={Trophy}
                    title="ক্যারিয়ার প্রস্তুতি"
                    subtitle="জব রেডি স্কিল ডেভেলপমেন্ট"
                    className="absolute sm:bottom-0 bottom-0 sm:left-1/2 left-1/2 sm:-translate-x-1/2 -translate-x-1/2 z-10"
                    highlight
                  />
                </div>
              </div>

              {/* checklist */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <CheckItem text="লাইভ প্র্যাকটিস" />
                <CheckItem text="ক্লাস টাস্ক" />
                <CheckItem text="ল্যাব সাপোর্ট" />
                <CheckItem text="দৈনিক মূল্যায়ন" />
              </div>
            </div>

            {/* floating badge */}
            <div className="absolute -top-6 sm:-right-6 -right-1 backdrop-blur-md bg-green-500/20 border border-green-400/30 px-4 py-3 rounded-xl shadow-lg">
              <p className="text-sm font-semibold">প্র্যাকটিক্যাল ভিত্তিক</p>
            </div>
          </div>

          {/* ================= RIGHT — SUPPORTING PROOF CLUSTER ================= */}

          <div className="relative">
            <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-2">
              <Card
                icon={Briefcase}
                title="ক্যারিয়ার সাপোর্ট"
                description="ভবিষ্যৎ আয়ের সুযোগ তৈরিতে প্রয়োজনীয় ডিজিটাল স্কিল গড়ে তোলা হয়।"
              />

              <Card
                icon={BadgeCheck}
                title="জব-রেডি স্কিল"
                description="অফিস ও কর্মক্ষেত্রে সরাসরি কাজে লাগবে এমন বাস্তব স্কিল শেখানো হয়।"
              />

              <Card
                icon={GraduationCap}
                title="অভিজ্ঞ প্রশিক্ষক"
                description="শুধু তত্ত্ব নয়, প্রতিটি বিষয়ের বাস্তব ব্যবহার শেখানো হয় ল্যাব প্র্যাকটিসে।"
              />

              <Card
                icon={FileSpreadsheet}
                title="অফিস সফটওয়্যার"
                description="Word, Excel, PowerPoint বাস্তব কাজের মাধ্যমে আয়ত্ত করা হয়"
              >
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  ফিচার
                </span>
              </Card>

              <Card
                icon={Keyboard}
                title="নির্ভুল টাইপিং"
                description="স্পিড ও একিউরেসি বাড়াতে বিশেষ প্র্যাকটিস মডিউল অনুসরণ করা হয়|"
              >
                <RadialProgress value={90} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-md bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs">
        ✓
      </div>
      <span className="opacity-80">{text}</span>
    </div>
  );
}

function ValueChip({
  icon: Icon,
  title,
  subtitle,
  highlight,
  className = "",
}: any) {
  return (
    <div
      className={`
        w-40 h-40
        backdrop-blur-xl bg-white/10 border border-white/20
        rounded-2xl p-4 shadow-xl
        flex flex-col justify-between
        ${highlight ? "ring-1 ring-blue-400/40" : ""}
        ${className}
      `}
    >
      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
        <Icon size={20} />
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-xs opacity-70 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}
