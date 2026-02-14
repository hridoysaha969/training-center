export type Course = {
  id: string;
  name: string;
  code: string; // e.g. BC
  durationMonths: 3 | 6;
  fee: number;
};

export const courses: Course[] = [
  {
    id: "basic-computer-3",
    name: "Basic Computer",
    code: "BC",
    durationMonths: 3,
    fee: 3500,
  },
  {
    id: "office-application-3",
    name: "Office Application",
    code: "OA",
    durationMonths: 3,
    fee: 4000,
  },
  {
    id: "graphic-design-6",
    name: "Graphic Design",
    code: "GD",
    durationMonths: 6,
    fee: 8000,
  },
  {
    id: "web-development-6",
    name: "Web Development",
    code: "WD",
    durationMonths: 6,
    fee: 12000,
  },
];
