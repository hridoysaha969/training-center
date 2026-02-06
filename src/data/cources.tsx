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
  students: string;
  highlights: string[];
  learningOutcomes: string[];
  modules: { title: string; lessons: string[] }[];
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
    students: "২০+",
    highlights: [
      "পূর্ণ অফিস + আইটি স্কিল প্যাকেজ",
      "রিয়েল অফিস ওয়ার্কফ্লো প্র্যাকটিস",
      "অ্যাডভান্সড রিপোর্টিং",
      "ক্যারিয়ার রেডি ট্রেনিং",
    ],

    learningOutcomes: [
      "প্রফেশনাল অফিস ডকুমেন্ট ও রিপোর্ট তৈরি করতে পারবে",
      "Excel দিয়ে ডাটা বিশ্লেষণ ও রিপোর্টিং করতে পারবে",
      "অফিস ফাইল ও ডাটা ম্যানেজমেন্ট সিস্টেম বুঝবে",
      "প্রফেশনাল প্রেজেন্টেশন ডিজাইন করতে পারবে",
      "ইন্টারনেট ও ইমেইল অফিস স্ট্যান্ডার্ডে ব্যবহার করতে পারবে",
      "দৈনন্দিন অফিস টাস্ক স্বাধীনভাবে পরিচালনা করতে পারবে",
    ],

    modules: [
      {
        title: "অফিস কম্পিউটিং ফাউন্ডেশন",
        lessons: [
          "কম্পিউটার ও অফিস আইটি ধারণা",
          "Windows প্রফেশনাল ব্যবহার",
          "ফাইল স্ট্রাকচার ম্যানেজমেন্ট",
        ],
      },
      {
        title: "MS Word Pro অফিস ডকুমেন্ট",
        lessons: ["অফিস লেটার ও রিপোর্ট", "টেমপ্লেট ও স্টাইল", "মেইল মার্জ"],
      },
      {
        title: "Excel Data & Reporting",
        lessons: ["অ্যাডভান্সড ফর্মুলা", "ডাটা ফিল্টার ও চার্ট", "রিপোর্ট শীট"],
      },
      {
        title: "Office Presentation Skills",
        lessons: ["কর্পোরেট স্লাইড", "ডাটা ভিজুয়ালাইজেশন"],
      },
    ],
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
    students: "৫০+",
    highlights: [
      "বেসিক থেকে অফিস প্রস্তুতি",
      "স্টেপ বাই স্টেপ শেখানো",
      "প্র্যাকটিক্যাল ল্যাব",
      "নতুনদের জন্য উপযোগী",
    ],

    learningOutcomes: [
      "কম্পিউটার বেসিক অপারেশন শিখবে",
      "MS Word দিয়ে সাধারণ ডকুমেন্ট তৈরি করতে পারবে",
      "Excel এ বেসিক হিসাব করতে পারবে",
      "PowerPoint প্রেজেন্টেশন বানাতে পারবে",
      "ইমেইল ও ইন্টারনেট ব্যবহার করতে পারবে",
      "ফাইল ও ফোল্ডার সাজাতে পারবে",
    ],

    modules: [
      {
        title: "অধ্যায় ১: কম্পিউটার ফান্ডামেন্টালস",
        lessons: [
          "কম্পিউটার পরিচিতি ও ইতিহাস",
          "হার্ডওয়্যার ও সফটওয়্যার, ইনপুট–আউটপুট ডিভাইস",
          "Windows 10/11 অপারেটিং সিস্টেম",
          "ফাইল ও ফোল্ডার ম্যানেজমেন্ট",
        ],
      },
      {
        title: "অধ্যায় ২: টাইপিং দক্ষতা",
        lessons: [
          "কিবোর্ড ও Home Row টেকনিক",
          "ইংরেজি টাইপিং স্পিড কৌশল",
          "অভ্র ও বিজয় বাংলা টাইপিং",
          "বেসিক শর্টকাট কী",
        ],
      },
      {
        title: "অধ্যায় ৩: MS Word (Basic → Intermediate)",
        lessons: [
          "ডকুমেন্ট তৈরি ও পেজ সেটআপ",
          "টেক্সট ফরম্যাটিং",
          "প্যারাগ্রাফ ও বুলেট",
          "টেবিল ডিজাইন",
          "ছবি ও শেপ যোগ",
          "হেডার, ফুটার, পেজ নম্বর",
        ],
      },
      {
        title: "অধ্যায় ৪: MS Excel (Basic)",
        lessons: [
          "ওয়ার্কশিট ও সেল ধারণা",
          "ডাটা এন্ট্রি",
          "বেসিক ফর্মুলা",
          "AutoSum ও ফিল্টার",
        ],
      },
      {
        title: "অধ্যায় ৫: ইন্টারনেট ও ইমেইল",
        lessons: [
          "গুগল সার্চ সঠিক ব্যবহার",
          "ইমেইল অ্যাকাউন্ট ও প্রফেশনাল মেইল",
          "ফাইল ডাউনলোড ও প্রিন্ট",
        ],
      },
    ],
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
    students: "৫০+",
    highlights: [
      "স্পিড + একিউরেসি ফোকাস",
      "বাংলা + ইংরেজি টাইপিং",
      "ডেইলি প্র্যাকটিস ল্যাব",
      "শর্টকাট কৌশল",
    ],

    learningOutcomes: [
      "ইংরেজি টাইপিং স্পিড উল্লেখযোগ্যভাবে বাড়বে",
      "বাংলা টাইপিং সফটওয়্যার দক্ষতা অর্জন করবে",
      "কম ভুলে টাইপ করতে পারবে",
      "কিবোর্ড শর্টকাট ব্যবহার শিখবে",
      "প্রফেশনাল ডকুমেন্ট টাইপ করতে পারবে",
    ],

    modules: [
      {
        title: "Keyboard Mastery",
        lessons: ["Home Row টেকনিক", "ফিঙ্গার পজিশন"],
      },
      {
        title: "English Typing",
        lessons: ["স্পিড ড্রিল", "Accuracy practice"],
      },
      {
        title: "Bangla Typing",
        lessons: ["অভ্র", "বিজয় বায়ান্ন"],
      },
    ],
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
    students: "৫০+",
    highlights: [
      "রিয়েল ডাটা প্র্যাকটিস",
      "ফর্মুলা ফোকাস",
      "রিপোর্টিং স্কিল",
      "চার্ট ও বিশ্লেষণ",
    ],

    learningOutcomes: [
      "Excel ফর্মুলা আত্মবিশ্বাসের সাথে ব্যবহার করবে",
      "ডাটা সাজানো ও ফিল্টার করতে পারবে",
      "চার্ট ও গ্রাফ তৈরি করতে পারবে",
      "অফিস রিপোর্ট শীট বানাতে পারবে",
      "ডাটা ক্লিনিং ও অর্গানাইজেশন শিখবে",
    ],

    modules: [
      {
        title: "Excel Foundation",
        lessons: ["Worksheet structure", "Cell formatting"],
      },
      {
        title: "Formulas",
        lessons: ["SUM, AVERAGE", "Logical formulas"],
      },
      {
        title: "Data Tools",
        lessons: ["Filter", "Sort", "Validation"],
      },
      {
        title: "Reporting",
        lessons: ["Charts", "Summary sheets"],
      },
    ],
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
    students: "৫০+",
    highlights: [
      "AI টুলস হ্যান্ডস-অন",
      "ফ্রিল্যান্স মার্কেটপ্লেস",
      "রিয়েল গিগ প্রস্তুতি",
      "আর্নিং ফোকাস",
    ],

    learningOutcomes: [
      "ফ্রিল্যান্সিং প্ল্যাটফর্ম বুঝবে",
      "AI টুল দিয়ে কাজ দ্রুত করতে পারবে",
      "প্রোফাইল ও গিগ তৈরি শিখবে",
      "বেসিক ক্লায়েন্ট কমিউনিকেশন শিখবে",
      "অনলাইন আয়ের পথ বুঝবে",
    ],

    modules: [
      {
        title: "Freelance Basics",
        lessons: ["Marketplace intro", "Profile setup"],
      },
      {
        title: "Gig Building",
        lessons: ["Gig writing", "Pricing"],
      },
      {
        title: "AI Tools",
        lessons: ["Content AI", "Design AI", "Productivity AI"],
      },
    ],
  },
];
