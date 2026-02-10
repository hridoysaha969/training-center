"use client";

import { useEffect, useState } from "react";

/* ---------- types ---------- */

type GuardianForm = {
  guardianName: string;
  relation: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
};

/* ---------- simple encode/decode ---------- */

const encode = (obj: GuardianForm) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
const decode = (str: string): GuardianForm =>
  JSON.parse(decodeURIComponent(escape(atob(str))));

const STORAGE_KEY = "adm_step2_secure";

export default function Step2Guardian() {
  const [form, setForm] = useState<GuardianForm>({
    guardianName: "",
    relation: "",
    phone: "",
    email: "",
    occupation: "",
    address: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof GuardianForm, string>>
  >({});

  /* ---------- restore ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log(saved);
    if (saved) {
      try {
        setForm(decode(saved));
      } catch {
        console.log("something went wrong");
      }
    }
  }, []);

  /* ---------- autosave ---------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, encode(form));
  }, [form]);

  /* ---------- updater ---------- */
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

  /* ---------- validator ---------- */
  const validate = () => {
    const e: Partial<Record<keyof GuardianForm, string>> = {};

    if (!form.guardianName.trim()) e.guardianName = "অভিভাবকের নাম আবশ্যক";
    if (!form.relation.trim()) e.relation = "সম্পর্ক আবশ্যক";
    if (!form.phone.trim()) e.phone = "ফোন নাম্বার আবশ্যক";
    if (!form.occupation.trim()) e.occupation = "অভিভাবকের পেশা আবশ্যক";
    if (!form.address.trim()) e.address = "ঠিকানা আবশ্যক";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    (window as any).__step2Validate = validate;

    return () => {
      delete (window as any).__step2Validate;
    };
  }, [form]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">অভিভাবকের তথ্য</h2>
      <p className="text-zinc-700 dark:text-zinc-200 mb-6">
        অভিভাবকের যোগাযোগের বিস্তারিত {"(ইংরেজিতে পূরণ করুন)"}
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <Field
          label="অভিভাবকের নাম*"
          value={form.guardianName}
          name="guardianName"
          onChange={handleChange}
          error={errors.guardianName}
        />

        <Field
          label="সম্পর্ক*"
          value={form.relation}
          name="relation"
          onChange={handleChange}
          error={errors.relation}
        />

        <Field
          label="মোবাইল*"
          value={form.phone}
          name="phone"
          onChange={handleChange}
          error={errors.phone}
        />

        <Field
          label="ইমেইল (যদি থাকে)"
          type="email"
          value={form.email}
          name="email"
          onChange={handleChange}
          error={errors.email}
        />

        <Field
          label="পেশা*"
          value={form.occupation}
          name="occupation"
          onChange={handleChange}
          error={errors.occupation}
        />

        <Field
          label="ঠিকানা"
          className="md:col-span-2"
          value={form.address}
          name="address"
          onChange={handleChange}
          error={errors.address}
        />
      </div>
    </>
  );
}

/* ---------- Field component ---------- */

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  error?: string;
  className?: string;
  type?: string;
};

function Field({
  label,
  value,
  name,
  onChange,
  error,
  className,
  type = "text",
}: FieldProps) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        className={`w-full mt-1 px-4 py-2 rounded-xl border border-zinc-500 bg-transparent outline-none focus:ring-2
        ${error ? "border-red-500" : ""}`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
