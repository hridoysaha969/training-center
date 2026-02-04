"use client";

import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section className="relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              আজই শুরু করুন আপনার শেখার যাত্রা
            </h2>

            <p className="mt-4 max-w-lg text-zinc-600 dark:text-zinc-300">
              গ্র্যান্ড ওপপেনিং উপলক্ষে সীমিত সংখ্যক আসনে ভর্তি চলছে।
              বাস্তবভিত্তিক কম্পিউটার দক্ষতা অর্জনের জন্য এখনই আমাদের সাথে
              যোগাযোগ করুন।
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                <Phone size={18} />
                <span>+880 18283 04973</span>
              </div>

              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                <Mail size={18} />
                <span>contact.ecitc@gmail.com</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-2xl"
          >
            <h3 className="mb-6 text-xl font-semibold">
              কল ব্যাকের জন্য অনুরোধ করুন
            </h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="পূর্ণ নাম"
                className="w-full rounded-xl border border-zinc-400 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="tel"
                placeholder="ফোন নাম্বার"
                className="w-full rounded-xl border border-zinc-400 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <select
                className="w-full appearance-none rounded-xl border border-zinc-500 
             bg-transparent px-4 py-3 text-sm text-slate-600 dark:text-zinc-300 
             outline-none focus:border-blue-500"
              >
                <option value="" className="bg-zinc-900 text-slate-300">
                  কোর্স নির্বাচন করুন
                </option>
                <option
                  value="ecitc-basic"
                  className="bg-zinc-900 text-slate-200"
                >
                  কম্পিউটার অফিস অ্যাপ্লিকেশন (বেসিক)
                </option>
                <option
                  value="ecitc-advance"
                  className="bg-zinc-900 text-slate-200"
                >
                  অ্যাডভান্সড আইটি অ্যান্ড অফিস ম্যানেজমেন্ট
                </option>
              </select>

              <button
                type="submit"
                className="group text-white inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                অনুরোধ পাঠান
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                আমরা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
