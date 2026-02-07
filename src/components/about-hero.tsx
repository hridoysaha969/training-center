import { Users, TrendingUp, Award, MonitorCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AboutHeroSection() {
  return (
    <section className="relative py-20">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — Identity Content */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            আমরা শুধু কম্পিউটার শেখাই না —
            <br />
            দক্ষ মানুষ তৈরি করি
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            প্র্যাকটিক্যাল ল্যাব, বাস্তবমুখী কারিকুলাম এবং ব্যক্তিগত গাইডলাইনের
            মাধ্যমে শিক্ষার্থীদের কর্মজীবনের জন্য প্রস্তুত করা হয়।
          </p>

          {/* Trust Chips */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">যাচাইকৃত প্রশিক্ষণ কেন্দ্র</Badge>
            <Badge variant="secondary">অফলাইন প্র্যাকটিক্যাল ক্লাস</Badge>
            <Badge variant="secondary">ছোট ব্যাচ সিস্টেম</Badge>
            <Badge variant="secondary">সার্টিফিকেট প্রদান</Badge>
          </div>
        </div>

        {/* RIGHT — Glass Stats Dashboard */}
        <div className="relative">
          <div className="rounded-3xl border bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-8 shadow-xl">
            <h3 className="font-semibold mb-6 text-lg">
              প্রশিক্ষণ কেন্দ্রের সারসংক্ষেপ
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <Stat icon={Users} value="৫০০+" label="শিক্ষার্থী" />
              <Stat icon={TrendingUp} value="৯৫%" label="কোর্স সম্পন্ন হার" />
              <Stat icon={Award} value="৪+ বছর" label="অভিজ্ঞতা" />
              <Stat
                icon={MonitorCheck}
                value="১০০%"
                label="প্র্যাকটিক্যাল ল্যাব"
              />
            </div>
          </div>

          {/* soft glow background */}
          <div className="absolute -z-10 inset-0 blur-3xl opacity-30 bg-linear-to-r from-indigo-500 to-cyan-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-xl bg-muted">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
