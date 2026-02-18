import AdmissionPage from "@/components/admin/admission";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions | Admin | Excel Computer & IT Center",
  description: "Manage student admissions in the admin dashboard.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


const page = () => {
  return (
    <>
      <AdmissionPage />
    </>
  );
};

export default page;
