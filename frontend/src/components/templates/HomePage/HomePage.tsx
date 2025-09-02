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
      <section className="py-2xl">
        <div className="container mx-auto">
          <h2 className="text-h2 font-heading uppercase text-center mb-xl">
            Plan Your <span className="bg-clip-text text-transparent bg-primary-gradient">Financing</span>
          </h2>
          <InstallmentCalculator />
        </div>
      </section>
    </>
  );
};

export default HomePage;
