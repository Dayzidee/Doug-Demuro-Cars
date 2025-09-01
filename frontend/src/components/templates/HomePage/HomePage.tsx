import HeroSection from "../../organisms/HeroSection/HeroSection";
import FeaturedCarsCarousel from "../../organisms/FeaturedCarsCarousel/FeaturedCarsCarousel";
import TrustIndicators from "../../organisms/TrustIndicators/TrustIndicators";
import GalleryPreview from "../../organisms/GalleryPreview";
import DynamicPromoSection from "../../organisms/DynamicPromoSection";
import InstallmentCalculator from "../../molecules/InstallmentCalculator";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCarsCarousel />
      <TrustIndicators />
      <GalleryPreview />
      <DynamicPromoSection />
      <section className="py-12 md:py-16 bg-gray-800">
        <InstallmentCalculator />
      </section>
    </>
  );
};

export default HomePage;
