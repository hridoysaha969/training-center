"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Monitor,
  FileCheck,
  Award,
  Briefcase,
} from "lucide-react";
import Title from "./title";

const steps = [
  {
    step: "01",
    title: "Admission",
    description:
      "Enroll with proper guidance and choose the right course based on your goal.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Training",
    description:
      "Hands-on practical training with experienced instructors and real tasks.",
    icon: Monitor,
  },
  {
    step: "03",
    title: "Assessment",
    description:
      "Skill evaluation through practical exams, assignments, and attendance.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Certificate",
    description:
      "Receive a verified certificate after successful course completion.",
    icon: Award,
  },
  {
    step: "05",
    title: "Career Support",
    description:
      "Guidance for jobs, freelancing, and career growth after training.",
    icon: Briefcase,
  },
];

export default function LearningProcess() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Title
            title="Our Learning Process"
            subtitle="A clear and simple journey from admission to career readiness."
          />
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Step number */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Step {item.step}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                    <Icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
