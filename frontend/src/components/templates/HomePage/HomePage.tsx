import HeroSection from "../../organisms/HeroSection/HeroSection";
import ValueProposition from "../../organisms/ValueProposition/ValueProposition";
import FeaturedCarsCarousel from "../../organisms/FeaturedCarsCarousel/FeaturedCarsCarousel";
import TrustIndicators from "../../organisms/TrustIndicators/TrustIndicators";
import GalleryPreview from "../../organisms/GalleryPreview";
import DynamicPromoSection from "../../organisms/DynamicPromoSection";
import InstallmentCalculator from "../../molecules/InstallmentCalculator";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ValueProposition />
      <FeaturedCarsCarousel />
      <TrustIndicators />
      <GalleryPreview />
      <DynamicPromoSection />
      <section className="py-12 md:py-16 bg-gray-800">
        <div className="container mx-auto">
          <InstallmentCalculator />
        </div>
      </section>
    </>
  );
};

export default HomePage;
