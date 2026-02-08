"use client";

import BanglaCountUp from "./bangla-counter";

export default function HeroRight() {
  return (
    <div className="relative w-full h-105 flex items-center justify-center">
      {/* background glow */}
      <div className="absolute w-64 sm:w-72 h-64 sm:h-72 bg-blue-500/20 blur-3xl rounded-full -z-10" />

      {/* Main Glass Panel */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 w-[320px] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">লার্নিং ড্যাশবোর্ড</h3>
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
            সক্রিয়
          </span>
        </div>

        {/* Progress Block */}
        <ProgressRow title="এমএস ওয়ার্ড" percent={85} />
        <ProgressRow title="এক্সেল" percent={78} />
        <ProgressRow title="টাইপিং" percent={65} />

        {/* Certificate Badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-300/30">
          <div className="text-2xl">🏆</div>
          <div>
            <p className="text-sm font-medium">সার্টিফিকেট প্রস্তুত</p>
            <p className="text-xs opacity-80">চূড়ান্ত পরীক্ষার পর</p>
          </div>
        </div>
      </div>

      {/* Floating Mini Card */}
      <div className="absolute -top-6 -right-2 backdrop-blur-md bg-white/15 border border-white/20 px-4 py-3 rounded-xl shadow-lg rotate-6">
        <p className="text-sm font-semibold">সফলতার হার</p>
        <p className="text-xl font-bold">
          <BanglaCountUp end={98} />%
        </p>
      </div>

      {/* Floating Mini Card */}
      <div className="absolute -bottom-6 -left-2 backdrop-blur-md bg-white/15 border border-white/20 px-4 py-3 rounded-xl shadow-lg -rotate-6">
        <p className="text-sm font-semibold">শিক্ষার্থী</p>
        <p className="text-xl font-bold">
          <BanglaCountUp end={170} />+
        </p>
      </div>
    </div>
  );
}

function ProgressRow({ title, percent }: { title: string; percent: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{title}</span>
        <span className="font-medium">{percent.toLocaleString("bn-BD")}%</span>
      </div>

      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
