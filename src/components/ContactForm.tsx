"use client";
import { courses } from "@/data/cources";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.course.trim()
    ) {
      toast.error("অনুগ্রহ করে সব ফিল্ড পূরণ করুন।");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/call-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        toast.error("অনুরোধ পাঠানো যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।");
      }

      const result = await response.json();
      if (!result.success) {
        toast.error(
          result.message ||
            "অনুরোধ পাঠানো যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।",
        );
      }

      toast.success("আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে!");
      setFormData({
        name: "",
        phone: "",
        course: "",
      });
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="পূর্ণ নাম"
          className="w-full rounded-xl border border-zinc-400 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="ফোন নাম্বার"
          className="w-full rounded-xl border border-zinc-400 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
        />

        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="w-full appearance-none rounded-xl border border-zinc-500 
             bg-transparent px-4 py-3 text-sm text-slate-600 dark:text-zinc-300 
             outline-none focus:border-blue-500"
        >
          <option value="" className="bg-zinc-900 text-slate-300">
            কোর্স নির্বাচন করুন
          </option>

          {courses.map((course) => (
            <option
              key={course.id}
              value={course.id}
              className="bg-zinc-900 text-slate-200"
            >
              {course.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group text-white inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-70"
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
  );
};

export default ContactForm;
