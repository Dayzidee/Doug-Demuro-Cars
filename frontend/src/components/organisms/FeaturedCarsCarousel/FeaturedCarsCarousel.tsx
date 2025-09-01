import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVehicles } from '../../../services/api';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';

const FeaturedCarsCarousel = () => {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['featuredVehicles'],
    queryFn: fetchFeaturedVehicles,
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
    return (
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-charcoal mb-8">Featured Vehicles</h2>
          <p className="text-red-500">Error fetching vehicles: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-heading text-charcoal mb-8">Featured Vehicles</h2>
        <div className="flex space-x-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {vehicles?.map((vehicle) => (
            <div key={vehicle.id} className="snap-center flex-shrink-0 w-full sm:w-80 md:w-96">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarsCarousel;
