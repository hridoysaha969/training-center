import Contact from "@/components/contact";
import Courses from "@/components/courses";
import CTABanner from "@/components/cta-banner";
import Header from "@/components/header";
import WhyChooseUs from "@/components/why-choose-us";

export default async function Page() {
  return (
    <>
      <Header />
      <WhyChooseUs />
      {/* <TrustStats /> */}
      <Courses />
      <CTABanner />
      <Contact />
    </>
  );
}
