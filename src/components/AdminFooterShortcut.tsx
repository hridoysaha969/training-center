"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const AdminFooterShortcut = () => {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    timer.current = setTimeout(() => {
      router.push("/admin");
    }, 5000); // 2 sec hold
  };

  const endPress = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <div onTouchStart={startPress} onTouchEnd={endPress}>
      <div className="flex items-center gap-1.5 select-none">
        <Image
          src={`/excel-computer.png`}
          height={55}
          width={55}
          alt="Excel Computer"
        />
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Excel Computer & <br /> IT Center
        </h3>
      </div>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        বাস্তবভিত্তিক দক্ষতা ও ক্যারিয়ার উন্নয়নে নিবেদিত একটি প্রফেশনাল
        কম্পিউটার ট্রেনিং সেন্টার।
      </p>
    </div>
  );
};

export default AdminFooterShortcut;
