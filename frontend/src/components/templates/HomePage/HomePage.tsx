import HeroSection from "../../organisms/HeroSection/HeroSection";
import FeaturedCarsCarousel from "../../organisms/FeaturedCarsCarousel/FeaturedCarsCarousel";
import TrustIndicators from "../../organisms/TrustIndicators/TrustIndicators";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCarsCarousel />
      <TrustIndicators />
      {/* Other homepage sections will go here */}
      <div className="h-screen bg-white text-charcoal p-8">
        <h2 className="text-3xl font-heading">Placeholder for more sections</h2>
      </div>
    </>
  );
};

export default HomePage;
