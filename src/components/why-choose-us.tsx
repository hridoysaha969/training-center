"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, BadgeCheck, Clock, Headphones } from "lucide-react";
import Title from "./title";

const items = [
  {
    title: "অভিজ্ঞ প্রশিক্ষক",
    desc: "বাস্তব কাজের অভিজ্ঞতা সম্পন্ন শিক্ষক",
    no: "০১",
  },
  {
    title: "হাতে-কলমে প্রশিক্ষণ",
    desc: "প্রতিটি ক্লাসে লাইভ প্র্যাকটিস",
    no: "০২",
  },
  {
    title: "যাচাইকৃত সার্টিফিকেট",
    desc: "ভেরিফায়েবল সার্টিফিকেট প্রদান",
    no: "০৩",
  },
  {
    title: "নমনীয় ক্লাস সময়",
    desc: "সকাল ও সন্ধ্যা ব্যাচ সুবিধা",
    no: "০৪",
  },
  {
    title: "কোর্স শেষে সাপোর্ট",
    desc: "শেখার পরও গাইডলাইন",
    no: "০৫",
  },
];

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
                <div className="relative w-full sm:h-65 h-100">
                  {/* Middle Card */}
                  <CertCard
                    className="absolute sm:top-3 sm:left-2 left-1/8 rotate-[4deg] opacity-90"
                    title="কোর্স সার্টিফিকেট"
                    course="Computer Basic"
                    id="ECIT-2026-014"
                  />
                  {/* Front Card */}
                  <CertCard
                    className="absolute sm:top-0 top-50 sm:right-0 right-1/8 rotate-0 z-10"
                    title="কোর্স সার্টিফিকেট"
                    course="Office & Typing"
                    id="ECIT-2026-032"
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

          <div className="relative sm:h-105 h-120">
            {/* card 1 */}
            <ProofCard
              className="absolute top-0 left-0 -rotate-6"
              title="অভিজ্ঞ প্রশিক্ষক"
              desc="শিল্পক্ষেত্রের অভিজ্ঞতা সম্পন্ন প্রশিক্ষক"
              badge="৫+ বছর"
            />

            {/* card 2 */}
            <ProofCard
              className="absolute sm:top-24 top-30 right-0 rotate-[8deg]"
              title="যাচাইকৃত সার্টিফিকেট"
              desc="ভেরিফায়েবল সার্টিফিকেট প্রদান"
              badge="Verified"
            />

            {/* card 3 */}
            <ProofCard
              className="absolute bottom-0 left-10 rotate-[-4deg]"
              title="ছোট ব্যাচ"
              desc="ব্যক্তিগত মনোযোগ নিশ্চিত"
              badge="Focused"
            />

            {/* card 4 */}
            <ProofCard
              className="absolute sm:bottom-10 bottom-20 right-8 rotate-[5deg]"
              title="ক্যারিয়ার সাপোর্ট"
              desc="কোর্স শেষে গাইডলাইন"
              badge="Support"
            />
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

function ProofCard({ title, desc, badge, className }: any) {
  return (
    <div
      className={`w-65 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl ${className}`}
    >
      <div className="text-xs mb-2 opacity-60">{badge}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm opacity-80">{desc}</p>
    </div>
  );
}

function CertCard({ title, course, id, highlight, className = "" }: any) {
  return (
    <div
      className={`
        w-65 backdrop-blur-xl bg-white/10 border border-white/20
        rounded-2xl p-5 shadow-2xl
        ${highlight ? "ring-1 ring-blue-400/40" : ""}
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-semibold">{title}</p>
        <span className="text-[10px] px-2 py-1 rounded-md bg-green-500/20 border border-green-400/30">
          ✓ Verified
        </span>
      </div>

      <p className="text-xs opacity-70 mb-2">Course</p>
      <p className="font-medium">{course}</p>

      <p className="text-xs opacity-60 mt-3">Certificate ID</p>
      <p className="text-sm font-mono">{id}</p>
    </div>
  );
}

