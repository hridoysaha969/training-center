"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SubmitSuccess({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </motion.div>

        <h3 className="text-2xl font-bold mb-2">আবেদন সফলভাবে জমা হয়েছে</h3>

        <p className="text-muted-foreground mb-6">
          আপনার তথ্য সংরক্ষণ করা হয়েছে। আমরা দ্রুত যোগাযোগ করব।
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl bg-green-600 text-white"
        >
          <Link href="/">ঠিক আছে</Link>
        </button>
      </motion.div>
    </div>
  );
}
