import CourseCard from "@/components/CourseCard";
import Title from "@/components/title";
import { courses } from "@/data/cources";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ecitc.vercel.app"),

  title: "Courses",
  description:
    "Explore career-focused courses at Excel Computer & IT Center: Computer Office Applications, MS Office, Advanced Excel, Graphics Design, Web Design & Development, Digital Marketing, and more. Practical training, projects, and certificate support.",
  keywords: [
    "Excel Computer & IT Center courses",
    "computer course",
    "computer office application course",
    "MS Office course",
    "Microsoft Word course",
    "Microsoft Excel course",
    "Advanced Excel course",
    "PowerPoint course",
    "graphics design course",
    "Adobe Photoshop course",
    "Illustrator course",
    "web design course",
    "web development course",
    "front-end course",
    "Next.js course",
    "digital marketing course",
    "freelancing course",
    "IT training institute",
    "certificate course",
  ],
  category: "Education",

  alternates: {
    canonical: "/courses",
    languages: {
      "en-US": "/courses",
      "bn-BD": "/bn/courses",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "/courses",
    title: "Courses | Excel Computer & IT Center",
    description:
      "Browse professional computer & IT courses with practical classes, projects, and certificates. Choose the right course to start or upgrade your career.",
    siteName: "Excel Computer & IT Center",
    locale: "en_US",
    images: [
      {
        url: "/og/courses-og.png", // TODO: create this image in /public/og/courses-og.png
        width: 1200,
        height: 630,
        alt: "Courses - Excel Computer & IT Center",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Courses | Excel Computer & IT Center",
    description:
      "Explore career-focused computer & IT courses with practical training and real-world projects.",
    images: ["/og/courses-og.png"],
  },

  // Optional (nice-to-have)
  applicationName: "Excel Computer & IT Center",
  authors: [{ name: "Excel Computer & IT Center" }],
  creator: "Excel Computer & IT Center",
  publisher: "Excel Computer & IT Center",

  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
};

const page = async () => {
  const allCourse = courses;
  return (
    <section className="relative overflow-hidden pb-16 pt-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <Title
          title="আমাদের কোর্সসমূহ"
          subtitle="অভিজ্ঞ ট্রেইনারদের মাধ্যমে হাতে-কলমে শেখার সুযোগ — বাস্তব কাজের জন্য প্রস্তুত কোর্সসমূহ"
        />

        {/* Courses Grid */}
        <div className="relative">
          <div className="columns-1 lg:columns-2 gap-6">
            {allCourse.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
