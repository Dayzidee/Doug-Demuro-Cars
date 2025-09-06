import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVehicles } from "../../../services/api";
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';

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

  if (isLoading) {
    return (
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-charcoal mb-8">Featured Vehicles</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

    if (error) {
      return <p className="text-center text-red-400">Error: {error.message}</p>;
    }

    if (!vehicles || vehicles.length === 0) {
      return <p className="text-center text-body-lg">No featured vehicles available at the moment.</p>;
    }

    return (
      <div className="flex space-x-md overflow-x-auto pb-md snap-x snap-mandatory scrollbar-thin scrollbar-thumb-secondary-golden-yellow/50 scrollbar-track-glass">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="snap-start flex-shrink-0 w-full sm:w-80 md:w-96">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-2xl">
      <div className="container mx-auto">
        <h2 className="text-h2 font-heading uppercase text-center mb-xl">
          <span className="bg-clip-text text-transparent bg-secondary-gradient">
            Featured
          </span> Vehicles
        </h2>
        {renderContent()}
      </div>
    </section>
  );
};

export default FeaturedCarsCarousel;
