"use client";

import StepTimeline from "@/components/step-timeline";
import Step1Student from "@/components/step1-student";
import Step2Guardian from "@/components/step2-guardian";
import Step3Academic from "@/components/step3-academic";
import SubmitSuccess from "@/components/submit-success";
import { collectAdmissionData } from "@/lib/admission-collector";
import { hashPayload } from "@/lib/admission-hash";
import { resetAdmissionStorage } from "@/lib/admission-reset";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "শিক্ষার্থীর তথ্য",
    note: "শিক্ষার্থীর প্রাথমিক ব্যক্তিগত তথ্য",
  },
  {
    id: 2,
    title: "অভিভাবকের তথ্য",
    note: "অভিভাবকের যোগাযোগের বিস্তারিত",
  },
  {
    id: 3,
    title: "শিক্ষাগত তথ্য",
    note: "শিক্ষাগত যোগ্যতা ও পূর্ববর্তী শিক্ষা",
  },
];

export default function AdmissionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step3Valid, setStep3Valid] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const isLast = currentStep === steps.length;

  const next = async () => {
    const validator = (window as any)[`__step${currentStep}Validate`];

    if (typeof validator === "function") {
      if (!validator()) return;
    }

    if (currentStep === steps.length) {
      await finalSubmit(setSuccessOpen);
      return;
    }

    setCurrentStep((s) => Math.min(s + 1, steps.length));
  };

  const back = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  return (
    <>
      <div className="layout pb-20 pt-28 overflow-hidden bg-white dark:bg-zinc-950">
        {/* Colorful Blurry Background Blob */}
        <div className="absolute top-0 left-0 w-150 h-150 bg-linear-to-tr from-purple-300 via-white to-green-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-50 rounded-full blur-3xl animate-pulse z-0" />

        {/* Optional Duplicate Blobs for Depth */}
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-linear-to-br from-fuchsia-200 via-transparent to-cyan-300 dark:from-fuchsia-700 dark:via-transparent dark:to-cyan-600 opacity-40 rounded-full blur-2xl z-0" />

        {/* Timeline */}
        <StepTimeline currentStep={currentStep} steps={steps} />

        {/* Step Container */}
        <div className="mt-12 relative overflow-hidden shadow-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentStep - 1) * 100}%)`,
            }}
          >
            {/* .slice(0, currentStep) */}
            {steps.map((step) => (
              <div key={step.id} className="w-full shrink-0 px-2">
                <StepPanel step={step} setStep3Valid={setStep3Valid} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={back}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-xl border disabled:opacity-40"
          >
            পূর্ববর্তী
          </button>

          <button
            onClick={next}
            disabled={isLast ? !step3Valid : false}
            className="px-6 py-2 rounded-xl bg-green-600 text-white disabled:opacity-40"
          >
            {isLast ? "সাবমিট" : "পরবর্তী"}
          </button>
        </div>
      </div>

      <SubmitSuccess
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          setCurrentStep(1); // optional reset wizard
        }}
      />
    </>
  );
}

function StepPanel({ step, setStep3Valid }: any) {
  return (
    <div className="rounded-2xl border p-8 min-h-65">
      <div className="">
        {step.id === 1 && <Step1Student />}
        {step.id === 2 && <Step2Guardian />}
        {step.id === 3 && <Step3Academic onValidChange={setStep3Valid} />}
      </div>
    </div>
  );
}

async function finalSubmit(setSuccessOpen: (open: boolean) => void) {
  const payload = collectAdmissionData();
  const fingerprint = await hashPayload(payload);

  const packet = { payload, fingerprint };

  // ===== encrypted packet preview =====
  console.log("ENCRYPTED ADMISSION PACKET");
  console.log(JSON.stringify(packet, null, 2));

  // ===== simulate server delay =====
  await new Promise((r) => setTimeout(r, 900));

  // ===== reset storage =====
  resetAdmissionStorage();

  // ===== open success modal =====
  setSuccessOpen(true);
}
