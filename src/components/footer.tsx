import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-zinc-950 border border-t-2">
      <div className="layout py-8">
        {/* Top Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 – Brand */}
          <div>
            <div className="flex items-center gap-1.5">
              <Image
                src={`/excel-computer.png`}
                height={55}
                width={55}
                alt="Excel Computer"
              />
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                Excel Computer & <br /> IT Center
              </h3>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              বাস্তবভিত্তিক দক্ষতা ও ক্যারিয়ার উন্নয়নে নিবেদিত একটি প্রফেশনাল
              কম্পিউটার ট্রেনিং সেন্টার।
            </p>
          </div>

          {/* Column 2 – Courses */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              কোর্স সমূহ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  {" "}
                  অ্যাডভান্সড আইটি অ্যান্ড অফিস ম্যানেজমেন্ট{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  {" "}
                  কম্পিউটার অফিস অ্যাপ্লিকেশন (বেসিক){" "}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  {" "}
                  বাংলা ও ইংরেজি কম্পিউটার টাইপিং{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  {" "}
                  অফিস এক্সেল ও ডাটা ম্যানেজমেন্ট{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  {" "}
                  ফ্রিল্যান্সিং বেসিক ও এআই টুলস{" "}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              গুরুত্বপূর্ণ লিংকসমূহ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#courses"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  কোর্স মডিউল
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  ভর্তি তথ্য
                </Link>
              </li>
              <li>
                <Link
                  href="#why-us"
                  className="hover:text-blue-500 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 transition"
                >
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-3">
                <Phone size={16} />
                <span>+880 18283 04973</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} />
                <span>contact.ecitc@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5" />
                <span>একতা মার্কেট - ২য় তলা, বলাখাল, হাজীগন্জ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/10" />

        {/* Bottom */}
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Your Institute. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
