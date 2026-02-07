import AboutTeamSection from "@/components/about-authority";
import AboutHeroSection from "@/components/about-hero";
import AboutJourneySection from "@/components/about-journey";
import Title from "@/components/title";

const page = () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-tr from-green-300 via-white to-purple-300 dark:from-purple-800 dark:via-transparent dark:to-green-700 opacity-80 blur-3xl" />
      </div>

      <Title
        title="আমাদের সম্পর্কে"
        subtitle="এক্সেল কম্পিউটার এবং আইটি সেন্টার সম্পর্কে বিস্তারিত"
      />

      <div className="layout">
        <AboutHeroSection />
        <AboutJourneySection />
        <AboutTeamSection />
      </div>
    </section>
  );
};

export default page;
