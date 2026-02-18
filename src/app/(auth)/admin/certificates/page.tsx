import CertificatesPage from "@/components/admin/CertificateIssue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates | Admin | Excel Computer & IT Center",
  description: "Issue and manage student certificates.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const page = () => {
  return <CertificatesPage />;
};

export default page;
