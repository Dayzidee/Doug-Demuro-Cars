import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api';
import { useFilterStore } from '../../../hooks/useFilterStore';
import { Vehicle } from '../../../data/mockVehicleData';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';
import FilterSidebar from '../../organisms/FilterSidebar/FilterSidebar';

const InventoryPage = () => {
  // Select the filter values from the store.
  // This component will re-render whenever these specific values change.
  const filters = useFilterStore((state) => ({
    make: state.make,
    model: state.model,
    priceMax: state.priceMax,
    bodyTypes: state.bodyTypes,
    fuelTypes: state.fuelTypes,
  }));

  const { data: vehicles, isLoading, isError, error } = useQuery<Vehicle[], Error>({
    // The queryKey includes the filters object. React Query will refetch
    // automatically whenever any value in this object changes.
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      // Clone the filters to avoid mutating the original store state
      const queryParams: any = { ...filters };

      // Convert array filters to comma-separated strings for the API
      if (queryParams.bodyTypes.length > 0) {
        queryParams.bodyType = queryParams.bodyTypes.join(',');
      }
      if (queryParams.fuelTypes.length > 0) {
        queryParams.fuelType = queryParams.fuelTypes.join(',');
      }
      delete queryParams.bodyTypes; // Clean up the object
      delete queryParams.fuelTypes; // Clean up the object

      // Remove null/empty values from filters before sending to the API
      const activeFilters = Object.fromEntries(
        Object.entries(queryParams).filter(([, value]) => value !== null && value !== '' && Array.isArray(value) === false)
      );

      const response = await apiClient.get('/vehicles/search', {
        params: activeFilters,
      });
      return response.data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-heading mb-8">Vehicle Inventory</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />

        <main className="flex-1">
          {isLoading && <p>Loading vehicles...</p>}
          {isError && <p className="text-red-500">Error fetching vehicles: {error.message}</p>}
          {vehicles && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))
              ) : (
                <p className="col-span-full">No vehicles found matching your criteria.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
