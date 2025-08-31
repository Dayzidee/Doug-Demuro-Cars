import HeroSection from "../../organisms/HeroSection/HeroSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      {/* Other homepage sections like 'Featured Cars' and 'Trust Indicators' will go here */}
      <div className="h-screen bg-white text-charcoal p-8">
        <h2 className="text-3xl font-heading">More Content Below</h2>
      </div>
    </>
  );
};

export default HomePage;
