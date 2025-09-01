import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api';
import { useFilterStore } from '../../../hooks/useFilterStore';
import { Vehicle } from '../../../data/mockVehicleData';
import VehicleCard from '../../molecules/VehicleCard/VehicleCard';
import FilterSidebar from '../../organisms/FilterSidebar/FilterSidebar';

// Define the shape of the API response
interface VehicleSearchResponse {
  data: Vehicle[];
  facets: any; // Using 'any' for now, can be typed more strictly later
}

const InventoryPage = () => {
  // Select the filter values from the store.
  const filters = useFilterStore((state) => ({
    make: state.make,
    model: state.model,
    priceRange: state.priceRange,
    yearRange: state.yearRange,
    bodyTypes: state.bodyTypes,
    fuelTypes: state.fuelTypes,
    sort: state.sort,
  }));
  const setSort = useFilterStore((state) => state.setSort);

  const { data, isLoading, isError, error } = useQuery<VehicleSearchResponse, Error>({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const queryParams: any = {
        ...filters,
        price_min: filters.priceRange[0],
        price_max: filters.priceRange[1],
        year_min: filters.yearRange[0],
        year_max: filters.yearRange[1],
      };

      if (queryParams.bodyTypes.length > 0) queryParams.bodyType = queryParams.bodyTypes.join(',');
      if (queryParams.fuelTypes.length > 0) queryParams.fuelType = queryParams.fuelTypes.join(',');

      delete queryParams.priceRange;
      delete queryParams.yearRange;
      delete queryParams.bodyTypes;
      delete queryParams.fuelTypes;

      const activeFilters = Object.fromEntries(
        Object.entries(queryParams).filter(([, value]) => value !== null && value !== '' && value !== 0 && (!Array.isArray(value) || value.length > 0))
      );

      const response = await apiClient.get('/vehicles/search', { params: activeFilters });
      return response.data;
    },
  });

  const vehicles = data?.data;
  const facets = data?.facets;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading">Vehicle Inventory</h1>
        <div>
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
          <select
            id="sort-by"
            className="p-2 border rounded-lg bg-white shadow-sm"
            value={filters.sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest First</option>
            <option value="year_asc">Year: Oldest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar facets={facets} isLoading={isLoading} />

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
