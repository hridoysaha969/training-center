import NewInvestmentPage from "@/components/admin/investment-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments | Admin | Excel Computer & IT Center",
  description: "Track expenses and investment records.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


const page = () => {
  return (
    <div>
      <NewInvestmentPage />
    </div>
  );
};

export default page;
