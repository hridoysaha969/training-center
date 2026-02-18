"use client";

import { useEffect, useState } from "react";

/* ===== same obfuscation pattern ===== */
function encode(data: any) {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

function decode(value: string) {
  try {
    const json = decodeURIComponent(escape(atob(value)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const STORAGE_KEY = "adm_step3_secure";

function Step3Academic({
  onValidChange,
}: {
  onValidChange?: (v: boolean) => void;
}) {
  const [form, setForm] = useState({
    educationLevel: "",
    institute: "",
    board: "",
    passingYear: "",
    computerExperience: "",
    hasLaptop: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ===== load saved ===== */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = decode(raw);
    if (parsed) setForm(parsed);
  }, []);

  /* ===== autosave ===== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, encode(form));
  }, [form]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  /* ===== validator ===== */
  function validate() {
    const e: Record<string, string> = {};

    if (!form.educationLevel) e.educationLevel = "শিক্ষাগত স্তর নির্বাচন করুন";
    if (!form.institute) e.institute = "প্রতিষ্ঠানের নাম দিন";
    if (!form.passingYear) e.passingYear = "পাসের সাল দিন";
    if (!form.computerExperience)
      e.computerExperience = "অভিজ্ঞতা নির্বাচন করুন";
    if (!form.hasLaptop) e.hasLaptop = "ডিভাইস তথ্য নির্বাচন করুন";

    setErrors(e);
    const ok = Object.keys(e).length === 0;

    onValidChange?.(ok); // ⭐ important
    return ok;
  }

  useEffect(() => {
    validate();
  }, [form]);

  /* ===== expose to parent next() ===== */
  useEffect(() => {
    (window as any).__step3Validate = validate;
    return () => {
      delete (window as any).__step3Validate;
    };
  }, [form]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold">শিক্ষাগত তথ্য</div>
        <div className="text-sm text-zinc-700 dark:text-zinc-200">
          শিক্ষাগত ব্যাকগ্রাউন্ড ও কম্পিউটার অভিজ্ঞতা প্রদান করুন
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Education Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium">শিক্ষাগত স্তর *</label>
          <select
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          >
            <option value="" className="bg-zinc-900 text-slate-200">
              নির্বাচন করুন
            </option>
            <option className="bg-zinc-900 text-slate-200">JSC / JDC</option>
            <option className="bg-zinc-900 text-slate-200">SSC / সমমান</option>
            <option className="bg-zinc-900 text-slate-200">HSC / সমমান</option>
            <option className="bg-zinc-900 text-slate-200">Diploma</option>
            <option className="bg-zinc-900 text-slate-200">
              Honours / Degree
            </option>
          </select>
          {errors.educationLevel && (
            <p className="text-xs text-red-600">{errors.educationLevel}</p>
          )}
        </div>

        {/* Passing Year */}
        <div className="space-y-2">
          <label className="text-sm font-medium">পাসের সাল *</label>
          <input
            name="passingYear"
            value={form.passingYear}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          />
          {errors.passingYear && (
            <p className="text-xs text-red-600">{errors.passingYear}</p>
          )}
        </div>

        {/* Institute */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">প্রতিষ্ঠানের নাম *</label>
          <input
            name="institute"
            value={form.institute}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          />
          {errors.institute && (
            <p className="text-xs text-red-600">{errors.institute}</p>
          )}
        </div>

        {/* Board */}
        <div className="space-y-2">
          <label className="text-sm font-medium">বোর্ড / বিশ্ববিদ্যালয়</label>
          <input
            name="board"
            value={form.board}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          />
        </div>

        {/* Computer Experience */}
        <div className="space-y-2">
          <label className="text-sm font-medium">কম্পিউটার অভিজ্ঞতা *</label>
          <select
            name="computerExperience"
            value={form.computerExperience}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          >
            <option value="" className="bg-zinc-900 text-slate-200">
              নির্বাচন করুন
            </option>
            <option className="bg-zinc-900 text-slate-200">
              কোন অভিজ্ঞতা নেই
            </option>
            <option value="basic" className="bg-zinc-900 text-slate-200">
              বেসিক জানি
            </option>
            <option value="intermediate" className="bg-zinc-900 text-slate-200">
              মাঝারি
            </option>
            <option value="advanced" className="bg-zinc-900 text-slate-200">
              অভিজ্ঞ
            </option>
          </select>
          {errors.computerExperience && (
            <p className="text-xs text-red-600">{errors.computerExperience}</p>
          )}
        </div>

        {/* Device */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            নিজস্ব ল্যাপটপ / পিসি আছে? *
          </label>
          <select
            name="hasLaptop"
            value={form.hasLaptop}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-500 px-4 py-2 bg-transparent"
          >
            <option value="" className="bg-zinc-900 text-slate-200">
              নির্বাচন করুন
            </option>
            <option value="yes" className="bg-zinc-900 text-slate-200">
              আছে
            </option>
            <option value="no" className="bg-zinc-900 text-slate-200">
              নেই
            </option>
          </select>
          {errors.hasLaptop && (
            <p className="text-xs text-red-600">{errors.hasLaptop}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step3Academic;
