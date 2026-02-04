"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden flex flex-col lg:flex-row md:items-center items-start justify-center bg-white dark:bg-zinc-950 py-6 md:py-12">
      {/* Colorful Blurry Background Blob */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-linear-to-tr from-purple-300 via-white to-green-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-50 rounded-full blur-3xl animate-pulse z-0" />

      {/* Optional Duplicate Blobs for Depth */}
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-linear-to-br from-fuchsia-200 via-transparent to-cyan-300 dark:from-fuchsia-700 dark:via-transparent dark:to-cyan-600 opacity-40 rounded-full blur-2xl z-0" />

      <div className="layout relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border backdrop-blur-xl bg-white/10 shadow-2xl border-white/20 p-10 md:p-16 text-center"
        >
          {/* badge */}
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            ভর্তি চলছে
          </span>

          {/* heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            আজই আপনার কম্পিউটার দক্ষতার যাত্রা শুরু করুন
          </h2>

          {/* subtext */}
          <p className="w-full sm:text-md sm:max-w-2xl mx-auto text-muted-foreground mb-8 leading-relaxed">
            সীমিত সিটে অফলাইন প্র্যাকটিক্যাল ভিত্তিক প্রশিক্ষণ। দক্ষ প্রশিক্ষক,
            ল্যাব সাপোর্ট এবং সার্টিফিকেটসহ কোর্স সম্পন্ন করার সুযোগ।
          </p>

          {/* actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <MessageCircle className="w-5 h-5" />
              ভর্তি তথ্য জানুন
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-blue-50 hover:bg-blue-100"
            >
              <Phone className="w-5 h-5" />
              সরাসরি কল করুন
            </Button>
          </div>

          {/* trust strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-muted-foreground">
            <div>✔ প্র্যাকটিক্যাল ক্লাস</div>
            <div>✔ ছোট ব্যাচ</div>
            <div>✔ অভিজ্ঞ প্রশিক্ষক</div>
            <div>✔ কোর্স শেষে সার্টিফিকেট</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
