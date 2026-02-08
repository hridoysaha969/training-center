"use client";

import { useEffect, useState } from "react";

// ===== simple obfuscation (not human‑readable in devtools) =====
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

const STORAGE_KEY = "adm_step1_secure";

function Step1Student() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== load saved data =====
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = decode(raw);
    if (parsed) setForm(parsed);
  }, []);

  // ===== autosave encrypted =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, encode(form));
  }, [form]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ===== expose validator for parent step control (next step gate later) =====
  function validate() {
    const e: Record<string, string> = {};

    if (!form.name) e.name = "নাম আবশ্যক";
    if (!form.dob) e.dob = "জন্ম তারিখ আবশ্যক";
    if (!form.gender) e.gender = "লিঙ্গ নির্বাচন করুন";
    if (!form.mobile || form.mobile.length < 10)
      e.mobile = "সঠিক মোবাইল নম্বর দিন";
    if (!form.address) e.address = "ঠিকানা আবশ্যক";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  useEffect(() => {
    (window as any).__step1Validate = validate;

    return () => {
      delete (window as any).__step1Validate;
    };
  }, [form]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold">শিক্ষার্থীর মৌলিক তথ্য</div>
        <div className="text-sm text-zinc-700 dark:text-zinc-200">
          এই ধাপে শিক্ষার্থীর প্রাথমিক তথ্য প্রদান করুন {"(ইংরেজিতে পূরণ করুন)"}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">পূর্ণ নাম *</label>
          <input
            className="w-full rounded-xl border px-4 py-2 bg-background"
            value={form.name}
            name="name"
            onChange={handleChange}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">জন্ম তারিখ *</label>
          <input
            type="date"
            className="w-full rounded-xl border px-4 py-2 bg-background"
            value={form.dob}
            name="dob"
            onChange={handleChange}
          />
          {errors.dob && <p className="text-xs text-red-600">{errors.dob}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">লিঙ্গ *</label>
          <select
            className="w-full rounded-xl border px-4 py-2 bg-background"
            value={form.gender}
            name="gender"
            onChange={handleChange}
          >
            <option value="">নির্বাচন করুন</option>
            <option value="male">পুরুষ</option>
            <option value="female">মহিলা</option>
            <option value="other">অন্যান্য</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-red-600">{errors.gender}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">মোবাইল নম্বর *</label>
          <input
            className="w-full rounded-xl border px-4 py-2 bg-background"
            value={form.mobile}
            name="mobile"
            onChange={handleChange}
          />
          {errors.mobile && (
            <p className="text-xs text-red-600">{errors.mobile}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ইমেইল (ঐচ্ছিক)</label>
          <input
            type="email"
            className="w-full rounded-xl border px-4 py-2 bg-background"
            value={form.email}
            name="email"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">বর্তমান ঠিকানা *</label>
          <textarea
            className="w-full rounded-xl border px-4 py-2 bg-background"
            rows={3}
            value={form.address}
            name="address"
            onChange={handleChange}
          />
          {errors.address && (
            <p className="text-xs text-red-600">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step1Student;
