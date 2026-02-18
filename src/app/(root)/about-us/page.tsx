import AboutTeamSection from "@/components/about-authority";
import AboutHeroSection from "@/components/about-hero";
import AboutJourneySection from "@/components/about-journey";
import Title from "@/components/title";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ecitc.vercel.app"),

  title: "About Us",
  description:
    "Learn about Excel Computer & IT Center — a career-focused computer training institute dedicated to practical learning, real-world projects, and professional skill development. Our mission is to prepare students for modern IT careers and freelancing opportunities.",

  keywords: [
    "about Excel Computer & IT Center",
    "computer training institute",
    "IT training center Bangladesh",
    "professional computer training",
    "career training institute",
    "Excel Computer & IT Center information",
    "computer education center",
    "IT education mission",
  ],

  category: "Education",

  alternates: {
    canonical: "/about-us",
    languages: {
      "en-US": "/about-us",
      "bn-BD": "/bn/about-us",
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
    url: "/about-us",
    title: "About Us | Excel Computer & IT Center",
    description:
      "Discover our mission, vision, and commitment to practical computer and IT training. Excel Computer & IT Center focuses on real-world skills and career success.",
    siteName: "Excel Computer & IT Center",
    locale: "en_US",
    images: [
      {
        url: "/og/home-og.png", // create this later in /public/og/
        width: 1200,
        height: 630,
        alt: "About Excel Computer & IT Center",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | Excel Computer & IT Center",
    description:
      "Learn about Excel Computer & IT Center, our mission, and how we help students build real IT skills.",
    images: ["/og/home-og.png"],
  },

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

const page = () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <Title
        title="আমাদের সম্পর্কে"
        subtitle="এক্সেল কম্পিউটার এবং আইটি সেন্টার সম্পর্কে বিস্তারিত"
      />

      <div className="layout">
        <AboutHeroSection />
        <AboutJourneySection />
        <AboutTeamSection />
      </div>
    </section>
  );
};

export default page;
