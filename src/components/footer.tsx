import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="layout py-8">
        {/* Top Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 – Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">Your Institute</h3>
            <p className="mt-4 text-sm leading-relaxed">
              Professional computer training center focused on practical skills
              and career growth.
            </p>
          </div>

          {/* Column 2 – Courses */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Courses
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Computer Office Application</li>
              <li>Graphic Design</li>
              <li>Web Development</li>
              <li>Digital Marketing</li>
            </ul>
          </div>

          {/* Column 3 – Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#courses" className="hover:text-white transition">
                  Courses
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition">
                  Why Choose Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 – Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} />
                <span>info@yourinstitute.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5" />
                <span>Your City, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/10" />

        {/* Bottom */}
        <div className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Your Institute. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
