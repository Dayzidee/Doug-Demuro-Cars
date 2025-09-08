import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVehicles } from "../../../services/api";
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedCarsCarousel = () => {
  const {
    data: vehicles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredVehicles"],
    queryFn: fetchFeaturedVehicles,
    select: (data) => data.filter((v) => v.is_featured).slice(0, 8),
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-lg text-neutral-metallic-silver">Loading featured vehicles...</p>;
    }

    if (error) {
      return <p className="text-center text-red-400">Error: {error.message}</p>;
    }

    if (!vehicles || vehicles.length === 0) {
      return <p className="text-center text-lg text-neutral-metallic-silver">No featured vehicles available.</p>;
    }

    return (
        <div
          ref={scrollContainerRef}
          className="flex space-x-md overflow-x-auto pb-md snap-x snap-mandatory scrollbar-thin scrollbar-thumb-secondary-golden-yellow/50 scrollbar-track-glass -mb-md"
        >
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="snap-start flex-shrink-0 w-full sm:w-80 md:w-96 pb-md">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
    );
  }

  return (
    <section className="py-2xl">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-xl">
            <h2 className="text-h2 font-heading uppercase">
              <span className="bg-clip-text text-transparent bg-secondary-gradient">
                Featured
              </span> Vehicles
            </h2>
            <div className="hidden md:flex items-center space-x-2">
                <button onClick={() => scroll(-400)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={() => scroll(400)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default FeaturedCarsCarousel;
