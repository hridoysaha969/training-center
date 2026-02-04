import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiscountPopup({
  active = true,
  title = "গ্র্যান্ড ওপেনিং অফার",
  subtitle = "নির্বাচিত কোর্সে সীমিত সময়ের বিশেষ ছাড় চলছে",
  discount = "২০%",
  cta = "এখনই ভর্তি হন",
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* popup card */}
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative w-[92%] max-w-3xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl"
          >
            {/* floating close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-4 -right-4 rounded-full bg-white shadow-lg p-2 hover:scale-105 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              সীমিত সময়ের অফার
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* left content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  {title}
                </h2>
                <p className="text-white/80 mb-6 text-lg">{subtitle}</p>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-3 shadow">
                    <Tag className="h-5 w-5" />
                    <span className="font-semibold">ডিসকাউন্ট</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white">
                    {discount}
                  </div>
                </div>

                <Button className="rounded-2xl px-8 py-6 text-lg">{cta}</Button>
              </div>

              {/* right visual */}
              <div className="relative h-56 md:h-64">
                <motion.div
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 6 }}
                  className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/30 to-white/5 border border-white/30 backdrop-blur-md p-6 flex flex-col justify-between"
                >
                  <div className="text-sm text-white/80">
                    স্পেশাল কোর্স প্যাক
                  </div>
                  <div className="text-5xl font-black text-white">
                    {discount}
                  </div>
                  <div className="text-sm text-white/70">
                    আজই ভর্তি সম্পন্ন করলে অফার প্রযোজ্য
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -bottom-4 -right-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 px-4 py-3 text-white text-sm"
                >
                  🎯 সিট সীমিত
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
