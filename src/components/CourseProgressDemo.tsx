"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Lock,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function CourseProgressDemo() {
  return (
    <div className="relative rounded-3xl border backdrop-blur-xl bg-white/10 shadow-2xl border-white/20 p-10 space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm text-muted-foreground">
          কোর্স প্রগ্রেস (ডেমো)
        </div>
        <div className="text-xl font-semibold">আপনার শেখার অগ্রগতি</div>
      </div>

      {/* Overall Progress Ring */}
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <svg className="h-24 w-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="10"
              className="text-white/20 fill-none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              className="text-blue-500 fill-none"
              strokeDasharray={251}
              strokeDashoffset={251 * (1 - 0.62)}
              initial={{ strokeDashoffset: 251 }}
              animate={{ strokeDashoffset: 251 * (1 - 0.62) }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center font-bold">
            ৬২%
          </div>
        </div>

        <div className="text-sm space-y-1">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={16} /> ১৮ / ২৯ লেসন সম্পন্ন
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} /> ১৪ ঘন্টা প্র্যাকটিস
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} /> ধারাবাহিক অগ্রগতি
          </div>
        </div>
      </div>

      {/* Module Bars */}
      <div className="space-y-4">
        {[
          { name: "কম্পিউটার ফান্ডামেন্টাল", p: 100 },
          { name: "MS Word", p: 80 },
          { name: "Excel", p: 55 },
          { name: "ইন্টারনেট", p: 20 },
        ].map((m) => (
          <div key={m.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{m.name}</span>
              <span>{m.p.toLocaleString("bn-BD")}%</span>
            </div>

            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.p}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Status */}
      <div className="rounded-2xl border bg-white/10 p-4 flex items-center gap-3">
        <Award className="w-6 h-6" />
        <div className="text-sm">
          সার্টিফিকেট
          <div className="text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            কোর্স সম্পন্ন হলে আনলক হবে
          </div>
        </div>
      </div>
    </div>
  );
}
