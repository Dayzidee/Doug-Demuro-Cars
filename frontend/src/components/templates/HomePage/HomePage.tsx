import HeroSection from "../../organisms/HeroSection/HeroSection";
import FeaturedCarsCarousel from "../../organisms/FeaturedCarsCarousel/FeaturedCarsCarousel";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCarsCarousel />
      {/* Other homepage sections like 'Trust Indicators' will go here */}
      <div className="h-screen bg-gray-200 text-charcoal p-8">
        <h2 className="text-3xl font-heading">Placeholder for more sections</h2>
      </div>
    </>
  );
};

export default HomePage;
