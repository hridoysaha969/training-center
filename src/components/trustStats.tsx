"use client";

import { motion } from "framer-motion";
import { Users, Award, Clock, CheckCircle } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "70+",
    label: "Students Trained",
  },
  {
    icon: Award,
    value: "1+",
    label: "Years Experience",
  },
  {
    icon: Clock,
    value: "Flexible",
    label: "Batch Timings",
  },
  {
    icon: CheckCircle,
    value: "Verified",
    label: "Certification",
  },
];

export default function TrustStats() {
  return (
    <section className="border-y py-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="layout">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <Icon size={22} />
                </div>

                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {item.value}
                </p>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
