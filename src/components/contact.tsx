"use client";

import { courses } from "@/data/cources";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";
import ContactForm from "./ContactForm";

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
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
