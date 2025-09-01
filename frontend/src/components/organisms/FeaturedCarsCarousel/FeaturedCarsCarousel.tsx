import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';

// Assuming VehicleCard expects a vehicle prop with at least this shape
interface Vehicle {
  id: string;
  // ... other vehicle properties
}

const FeaturedCarsCarousel: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/vehicles/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured vehicles');
        }
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  if (loading) return <div className="text-center p-8">Loading featured vehicles...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-heading text-charcoal mb-8">Featured Vehicles</h2>
        <div className="flex space-x-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="snap-start">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarsCarousel;
