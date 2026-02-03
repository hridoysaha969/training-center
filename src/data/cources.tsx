export type CourseLevel = "বেসিক" | "প্রফেশনাল" | "অ্যাডভান্সড";

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  skills: string[];
  level: CourseLevel;
  duration: string;
  classType: string[]; // e.g. ["অফলাইন ক্লাস", "ল্যাব প্র্যাকটিস"]
  outcomes: string[];
  targetGroup: string;
  accent: string; // tailwind color name e.g. "indigo", "emerald"
  regularPrice: number;
  offerPrice?: number; // optional
}

export const courses: Course[] = [
  {
    id: "advanced-it-office-management",
    title: "অ্যাডভান্সড আইটি অ্যান্ড অফিস ম্যানেজমেন্ট",
    subtitle: "অফিস ও আইটি সেক্টরের জন্য পূর্ণাঙ্গ প্রফেশনাল দক্ষতা তৈরি",
    skills: [
      "MS Word",
      "Excel",
      "PowerPoint",
      "Internet",
      "অফিস ফাইল ম্যানেজমেন্ট",
    ],
    level: "অ্যাডভান্সড",
    duration: "৬ মাস",
    classType: ["অফলাইন ক্লাস", "ল্যাব প্র্যাকটিস", "হ্যান্ডস-অন"],
    outcomes: [
      "অফিস ডকুমেন্ট তৈরি ও ফরম্যাটিং",
      "এক্সেল রিপোর্ট ও ডাটা ম্যানেজমেন্ট",
      "প্রফেশনাল প্রেজেন্টেশন তৈরি",
    ],
    targetGroup: "শিক্ষার্থী, চাকরি প্রার্থী, অফিস কর্মী",
    accent: "indigo",
    regularPrice: 6000,
    offerPrice: 5000,
  },
  {
    id: "computer-office-application-basic",
    title: "কম্পিউটার অফিস অ্যাপ্লিকেশন (বেসিক)",
    subtitle: "কম্পিউটার ব্যবহারের বেসিক জ্ঞান ও অফিস কাজের প্রস্তুতি",
    skills: ["MS Word", "Excel", "PowerPoint", "Internet Basics"],
    level: "বেসিক",
    duration: "৩ মাস",
    classType: ["অফলাইন ক্লাস", "ল্যাব প্র্যাকটিস"],
    outcomes: ["কম্পিউটার বেসিক অপারেশন", "অফিস সফটওয়্যার ব্যবহার"],
    targetGroup: "নতুন শিক্ষার্থী, বেসিক লার্নার",
    accent: "emerald",
    regularPrice: 3500,
    offerPrice: 3000,
  },
  {
    id: "bangla-english-typing",
    title: "বাংলা ও ইংরেজি কম্পিউটার টাইপিং",
    subtitle: "দ্রুত ও নির্ভুল টাইপিং দক্ষতা অর্জন",
    skills: ["বাংলা টাইপিং", "ইংরেজি টাইপিং", "স্পিড প্র্যাকটিস"],
    level: "প্রফেশনাল",
    duration: "২ মাস",
    classType: ["অফলাইন ক্লাস", "হ্যান্ডস-অন"],
    outcomes: ["টাইপিং স্পিড ও একিউরেসি বৃদ্ধি", "প্রফেশনাল ডকুমেন্ট টাইপিং"],
    targetGroup: "শিক্ষার্থী, চাকরি প্রার্থী",
    accent: "amber",
    regularPrice: 2500,
    offerPrice: 1500,
  },
  {
    id: "excel-data-management",
    title: "অফিস এক্সেল ও ডাটা ম্যানেজমেন্ট",
    subtitle: "ডাটা বিশ্লেষণ ও রিপোর্টিংয়ের বাস্তব দক্ষতা",
    skills: ["MS Excel", "Formulas", "Data Analysis", "Reports"],
    level: "প্রফেশনাল",
    duration: "৩ মাস",
    classType: ["অফলাইন ক্লাস", "ল্যাব প্র্যাকটিস"],
    outcomes: ["এক্সেল ফর্মুলা ও ফাংশন ব্যবহার", "ডাটা রিপোর্ট ও চার্ট তৈরি"],
    targetGroup: "অফিস কর্মী, চাকরি প্রার্থী",
    accent: "cyan",
    regularPrice: 4500,
    offerPrice: 4000,
  },
  {
    id: "freelancing-ai-tools",
    title: "ফ্রিল্যান্সিং বেসিক ও এআই টুলস",
    subtitle: "অনলাইন আয়ের জন্য প্রয়োজনীয় স্কিল ও আধুনিক এআই ব্যবহার",
    skills: ["Freelancing Basics", "AI Tools", "Online Platforms"],
    level: "প্রফেশনাল",
    duration: "৪ মাস",
    classType: ["অফলাইন ক্লাস", "হ্যান্ডস-অন"],
    outcomes: [
      "ফ্রিল্যান্সিং মার্কেটপ্লেস পরিচিতি",
      "এআই টুলস দিয়ে কাজের দক্ষতা",
    ],
    targetGroup: "শিক্ষার্থী, ফ্রিল্যান্স আগ্রহী",
    accent: "purple",
    regularPrice: 8000,
    offerPrice: 7500,
  },
];
