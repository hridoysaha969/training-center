"use client";

import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-950 py-24 text-white"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_60%)]" />

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
              Start Your Learning Journey Today
            </h2>

            <p className="mt-4 max-w-lg text-slate-300">
              Limited seats available for our grand opening batches. Contact us
              now to secure your spot and build real-world skills.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-200">
                <Phone size={18} />
                <span>+880 1XXX-XXXXXX</span>
              </div>

              <div className="flex items-center gap-3 text-slate-200">
                <Mail size={18} />
                <span>info@yourinstitute.com</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg"
          >
            <h3 className="mb-6 text-xl font-semibold">Request a Call Back</h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <select className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500">
                <option value="">Select Course</option>
                <option>Computer Office Application</option>
                <option>Graphic Design</option>
                <option>Web Development</option>
                <option>Digital Marketing</option>
              </select>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                Submit Inquiry
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <p className="text-xs text-slate-400">
                We’ll contact you within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
