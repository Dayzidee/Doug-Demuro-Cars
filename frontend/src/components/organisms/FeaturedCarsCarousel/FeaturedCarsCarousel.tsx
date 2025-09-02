import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleById } from "../../../services/api";
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';

const FeaturedCarsCarousel = () => {
  const {
    data: vehicles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicleById,
    select: (data) => data.filter((v) => v.is_featured).slice(0, 8),
  });

  const renderContent = () => {
    if (isLoading) {
      // Skeleton loader for better UX
      return (
        <div className="flex space-x-md overflow-x-hidden pb-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-full sm:w-80 md:w-96">
              <div className="bg-glass border border-glass rounded-xl shadow-lg h-96 animate-pulse"></div>
            </div>
          ))}
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
