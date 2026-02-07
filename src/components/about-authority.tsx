import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Settings, Landmark } from "lucide-react";
import Image from "next/image";

export default function AboutTeamSection() {
  return (
    <section className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold mb-4">প্রতিষ্ঠাতা টিম</h2>
          <p className="text-muted-foreground">
            অভিজ্ঞতা, দায়িত্ববোধ এবং বাস্তব কাজের সমন্বয়ে পরিচালিত একটি
            প্রশিক্ষণ কেন্দ্র।
          </p>
        </div>

        {/* TOP — Highlight Founder */}
        <FounderCard
          highlight
          icon={Settings}
          image="/team/ridoy-saha.png"
          name="Ridoy Chandra Saha"
          role="Co-Founder & Technical Director"
          desc="একাডেমিক প্রশিক্ষণ, টেকনিক্যাল কারিকুলাম এবং ইনস্টিটিউটের প্রযুক্তি প্ল্যাটফর্ম ও ওয়েবসাইট সিস্টেম পরিচালনা করেন।"
          chips={[
            "Academic Lead",
            "Technical Curriculum",
            "Platform & Website",
            "Training Supervision",
          ]}
        />

        {/* Bottom two */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <FounderCard
            icon={ShieldCheck}
            image="/team/sami-chowdhury.jpg"
            name="Abdulla Al Sami"
            role="Co-Founder & Administrative Director"
            desc="লাইসেন্স, রেগুলেটরি ডকুমেন্টেশন, TIN এবং আইনি কার্যক্রম তদারকি করে ইনস্টিটিউটের সুশৃঙ্খল পরিচালনা নিশ্চিত করেন।"
            chips={["Trade License", "Compliance", "TIN", "Legal Ops"]}
          />

          <FounderCard
            icon={Landmark}
            image="/team/al-zahid.png"
            name="Al Zahid"
            role="Co-Founder & Operations Director"
            desc="অ্যাডমিশন, ফি ম্যানেজমেন্ট, ব্যাংকিং লেনদেন ও ফাইন্যান্স অপারেশন পরিচালনা করেন এবং প্রশিক্ষণ কার্যক্রমেও যুক্ত আছেন।"
            chips={["Admissions", "Finance", "Banking", "Class Support"]}
          />
        </div>
      </div>
    </section>
  );
}

function FounderCard({
  icon: Icon,
  name,
  role,
  desc,
  chips,
  image,
  highlight = false,
}: {
  icon: any;
  name: string;
  role: string;
  desc: string;
  chips: string[];
  image: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-3xl border backdrop-blur-xl
        bg-white/60 dark:bg-zinc-900/60
        p-6 shadow-xl transition
        ${highlight ? "max-w-4xl mx-auto" : ""}
      `}
    >
      {highlight && (
        <Badge className="absolute -top-3 left-6">Lead Founder</Badge>
      )}

      <div className="grid md:grid-cols-[220px_1fr] gap-6 items-center">
        {/* Portrait */}
        <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="220px"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-muted">
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-muted-foreground">{role}</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-5 leading-relaxed">{desc}</p>

          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
