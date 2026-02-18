import ReportsPage from "@/components/admin/reports";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | Admin | Excel Computer & IT Center",
  description: "View analytics, financial reports, and performance data.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


const page = () => {
  return (
    <div className="p-4">
      <ReportsPage />
    </div>
  );
};

export default page;
