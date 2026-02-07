import { Rocket, Users, Laptop, Award, BookOpen } from "lucide-react";

export default function AboutJourneySection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl font-bold mb-4">আমাদের যাত্রার শুরু</h2>
          <p className="text-muted-foreground">
            একটি ছোট উদ্যোগ থেকে বাস্তবমুখী কম্পিউটার প্রশিক্ষণ কেন্দ্র — ধাপে
            ধাপে গড়ে উঠেছে শিক্ষার্থী-কেন্দ্রিক এই প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Horizontal milestone strip */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2 mt-4 z-20 relative">
            <Milestone
              icon={Rocket}
              year="শুরু"
              title="প্রশিক্ষণ কার্যক্রম চালু"
              text="ছোট ব্যাচ দিয়ে হাতে-কলমে ক্লাস শুরু"
            />

            <Milestone
              icon={Laptop}
              year="পর্ব ২"
              title="ল্যাব সেটআপ"
              text="প্রতিটি শিক্ষার্থীর জন্য প্র্যাকটিক্যাল ব্যবস্থা"
            />

            <Milestone
              icon={Users}
              year="পর্ব ৩"
              title="শিক্ষার্থী বৃদ্ধি"
              text="নিয়মিত ব্যাচ ও কোর্স সম্প্রসারণ"
            />

            <Milestone
              icon={BookOpen}
              year="পর্ব ৪"
              title="জব-রেডি কারিকুলাম"
              text="অফিস ও ক্যারিয়ারমুখী সিলেবাস"
            />

            <Milestone
              icon={Award}
              year="বর্তমান"
              title="সার্টিফিকেট প্রোগ্রাম"
              text="কোর্স শেষে স্বীকৃত সনদ প্রদান"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Milestone({
  icon: Icon,
  year,
  title,
  text,
}: {
  icon: any;
  year: string;
  title: string;
  text: string;
}) {
  return (
    <div className="w-64 select-none cursor-grab md:w-auto shrink-0 rounded-3xl border bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-muted">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {year}
        </span>
      </div>

      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
