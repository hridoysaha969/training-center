export type Course = {
  id: string;
  name: string;
  code: string; // e.g. BC
  durationMonths: 3 | 6;
  fee: number;
};

export const courses: Course[] = [
  {
    id: "advanced-office-management",
    name: "Advanced Office Management",
    code: "AOM",
    durationMonths: 6,
    fee: 5000,
  },
  {
    id: "computer-office-application-basic",
    name: "Computer & Office Application (Basic)",
    code: "COA",
    durationMonths: 3,
    fee: 3000,
  },
  {
    id: "bangla-english-typing",
    name: "Bangla & English Typing",
    code: "BET",
    durationMonths: 3,
    fee: 1500,
  },
  {
    id: "web-development-fundamentals",
    name: "Web Development Fundamentals",
    code: "WDF",
    durationMonths: 6,
    fee: 7500,
  },
  {
    id: "freelancing-ai-tools",
    name: "Freelancing & AI Tools",
    code: "FAI",
    durationMonths: 6,
    fee: 9500,
  },
];
