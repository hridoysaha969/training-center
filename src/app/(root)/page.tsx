import Contact from "@/components/contact";
import Courses from "@/components/courses";
import CTABanner from "@/components/cta-banner";
import Header from "@/components/header";
import { AdminShortcutWrapper } from "@/components/HotKeyWrapper";
import WhyChooseUs from "@/components/why-choose-us";

export default async function Page() {
  return (
    <>
      <AdminShortcutWrapper>
        <Header />
        <WhyChooseUs />
        <Courses />
        <CTABanner />
        <Contact />
      </AdminShortcutWrapper>
    </>
  );
}
