import Contact from "@/components/contact";
import Courses from "@/components/courses";
import Footer from "@/components/footer";
import GrandOpeningBanner from "@/components/GrandOpening";
import Header from "@/components/header";
import Hero from "@/components/header";
import LearningProcess from "@/components/learningProcess";
import TrustStats from "@/components/trustStats";
import WhyChooseUs from "@/components/why-choose-us";

export default async function Page() {
  return (
    <>
      <Header />
      <TrustStats />
      <Courses />
      <GrandOpeningBanner />
      <LearningProcess />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </>
  );
}
