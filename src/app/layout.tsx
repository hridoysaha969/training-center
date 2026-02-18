import { Toaster } from "sonner";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Base (important for absolute OG URLs)
  metadataBase: new URL("https://ecitc.vercel.app"),

  // Brand / App identity
  applicationName: "Excel Computer & IT Center",
  title: {
    default: "Excel Computer & IT Center",
    template: "%s | Excel Computer & IT Center",
  },

  // SEO essentials
  description:
    "Excel Computer & IT Center is a professional training institute offering practical computer courses, office applications, graphics design, web development, and IT skill programs. Learn with real-world projects, expert guidance, and career-focused support.",
  keywords: [
    "Excel Computer & IT Center",
    "computer training center",
    "IT training institute",
    "computer course",
    "office application course",
    "MS Office training",
    "Microsoft Excel training",
    "graphics design course",
    "web design course",
    "web development course",
    "freelancing course",
    "digital marketing course",
    "admission open",
    "certificate course",
    "career training",
    "Bangladesh IT training",
  ],
  category: "Education",

  // Ownership / Publishing
  authors: [{ name: "Excel Computer & IT Center" }],
  creator: "Excel Computer & IT Center",
  publisher: "Excel Computer & IT Center",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Canonical + language
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "bn-BD": "/bn",
    },
  },

  // Open Graph (Facebook / LinkedIn)
  openGraph: {
    type: "website",
    url: "/",
    title: "Excel Computer & IT Center",
    description:
      "Career-focused computer & IT training institute. Learn practical skills with real-world projects: Office Applications, Excel, Graphics, Web & IT programs.",
    siteName: "Excel Computer & IT Center",
    locale: "en_US",
    images: [
      {
        url: "/og/home-og.png",
        width: 1200,
        height: 630,
        alt: "Excel Computer & IT Center - Computer & IT Training Institute",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Excel Computer & IT Center",
    description:
      "Professional computer & IT training institute with practical courses and real-world projects.",
    images: ["/og/home-og.png"],
  },

  // Icons (place files in /public)
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },

  // Optional extras (nice for real products)
  manifest: "/site.webmanifest", // TODO: create /public/site.webmanifest
  referrer: "origin-when-cross-origin",

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children} <Toaster richColors />
      </body>
    </html>
  );
}
