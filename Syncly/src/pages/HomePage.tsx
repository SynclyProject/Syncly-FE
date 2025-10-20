import { HeroSection } from "../components/Landing/hero-section";
import { FeaturesSection } from "../components/Landing/features-section";
import { ProblemSection } from "../components/Landing/problem-section";
import { SolutionSection } from "../components/Landing/solution-section";
import { SecuritySection } from "../components/Landing/security-section";
import { ComparisonTable } from "../components/Landing/comparison-table";
import { Footer } from "../components/Landing/footer";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen mx-[74px] flex flex-col items-center gap-5 overflow-y-auto font-sans antialiased">
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProblemSection />
        <SolutionSection />
        <SecuritySection />
        <ComparisonTable />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
