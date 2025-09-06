import { useInfiniteQuery } from "@tanstack/react-query";
import { searchVehicles, type VehicleSummary } from "../../../services/api";
import { useFilterStore } from "../../../hooks/useFilterStore";
import VehicleCard from "../../molecules/VehicleCard/VehicleCard";
import FilterSidebar from "../../organisms/FilterSidebar/FilterSidebar";
import SortDropdown from "../../molecules/SortDropdown/SortDropdown";

// Define the shape of the API response
interface VehicleSearchResponse {
  data: VehicleSummary[];
  facets: any;
  total: number;
  hasMore: boolean;
}

// --- Helper Components for Different States ---

// Skeleton loader for the initial loading state
const VehicleGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-glass border border-glass rounded-xl shadow-lg h-96 animate-pulse"
      ></div>
    ))}
  </div>
);

// A new component to cleanly render the results grid and the "Load More" button
const VehicleGrid = ({
  vehicles,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: {
  vehicles: VehicleSummary[];
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}) => {
  if (vehicles.length === 0) {
    return (
      <p className="text-center text-body-lg col-span-full mt-2xl">
        No vehicles found matching your criteria.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <div className="text-center mt-xl">
        <button
          onClick={onLoadMore}
          disabled={!hasNextPage || isFetchingNextPage}
          className="bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </>
  );
};

// --- The Main Page Component ---

const InventoryPage = () => {
  // Data fetching and state management logic remains the same
  const {
    make,
    model,
    priceRange,
    yearRange,
    bodyTypes,
    fuelTypes,
    sortOrder,
  } = useFilterStore();

  const filters = { make, model, priceRange, yearRange, bodyTypes, fuelTypes };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    VehicleSearchResponse,
    Error,
    VehicleSearchResponse,
    any, // Using 'any' for the queryKey type for simplicity
    number
  >({
    queryKey: ["vehicles", filters, sortOrder],
    queryFn: ({ pageParam }) =>
      searchVehicles({ filters, sortOrder, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const vehicles = data?.pages.flatMap((page) => page.data) ?? [];
  const totalVehicles = data?.pages[0]?.total ?? 0;
  const facets = data?.pages[0]?.facets;

  // A helper function to decide what content to render
  const renderContent = () => {
    if (isLoading) {
      return <VehicleGridSkeleton />;
    }
    if (isError) {
      return <p className="text-center text-red-400">Error: {error.message}</p>;
    }
    // If we have data (even an empty array), render the grid component
    return (
      <VehicleGrid
        vehicles={vehicles}
        onLoadMore={() => fetchNextPage()}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    );
  };

  return (
    <div className="container mx-auto py-xl">
      <h1 className="text-h1 font-heading uppercase text-center mb-xl">
        <span className="bg-clip-text text-transparent bg-primary-gradient">
          Vehicle
        </span>{" "}
        Inventory
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar facets={facets} isLoading={isLoading} />

        <main className="flex-1">
          <div className="flex justify-between items-center mb-md">
            <p className="text-neutral-metallic-silver/80">
              Showing {vehicles.length} of {totalVehicles} vehicles
            </p>
            <SortDropdown />
          </div>

          {/* The main content area is now clean and simple */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
