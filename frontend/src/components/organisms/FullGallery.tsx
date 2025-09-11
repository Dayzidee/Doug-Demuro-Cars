import { useState, useEffect, useCallback, useMemo } from 'react';
import { mockVehicleData } from '../../data/mockVehicleData';

// Define the types based on the expected API response
interface VehicleData {
  make: string;
  model: string;
  year: number;
}

interface VehicleMedia {
  id: string;
  url: string;
  alt_text?: string;
  vehicles: VehicleData;
}

const FullGallery: React.FC = () => {
  const [images, setImages] = useState<VehicleMedia[]>([]);
  const [filters, setFilters] = useState({ make: '', year: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 30;

  const mockMediaMap = useMemo(() => {
    const map = new Map<string, { url: string; type: 'exterior' | 'interior' }[]>();
    mockVehicleData.forEach(vehicle => {
        map.set(`${vehicle.make}-${vehicle.model.replace(/\s+/g, '-')}`, vehicle.media);
    });
    return map;
  }, []);

  // Debounce the search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchImages = useCallback(async (isNewSearch: boolean) => {
    setLoading(true);
    setError(null);

    const currentPage = isNewSearch ? 1 : page;
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String((currentPage - 1) * PAGE_SIZE),
    });
    if (filters.make) params.append('make', filters.make);
    if (filters.year) params.append('year', filters.year);
    if (debouncedSearchTerm) params.append('q', debouncedSearchTerm);

    try {
      const response = await fetch(`/api/v1/gallery/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch images from the gallery.');

      const newImages: VehicleMedia[] = await response.json();

      // Hydrate the image URLs from our mock data
      const hydratedImages = newImages.map((image, index) => {
          const vehicleKey = `${image.vehicles.make}-${image.vehicles.model.replace(/\s+/g, '-')}`;
          const mockMedia = mockMediaMap.get(vehicleKey);
          if (mockMedia && mockMedia[index % mockMedia.length]) {
              return { ...image, url: mockMedia[index % mockMedia.length].url };
          }
          return image; // Fallback to API url if no match
      });

      setImages(prevImages => isNewSearch ? hydratedImages : [...prevImages, ...hydratedImages]);
      setHasMore(newImages.length === PAGE_SIZE);

    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedSearchTerm, mockMediaMap]);

  // Effect to trigger a new search when filters or debounced search term change
  useEffect(() => {
    setPage(1);
    fetchImages(true);
  }, [filters, debouncedSearchTerm, fetchImages]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Effect to fetch more images when page number increases
  useEffect(() => {
    if (page > 1) {
      fetchImages(false);
    }
  }, [page, fetchImages]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";

  return (
    <div className="flex flex-col md:flex-row gap-lg">
      <aside className="w-full md:w-1/4 p-lg bg-glass border border-glass rounded-xl shadow-2xl backdrop-blur-md h-fit self-start">
        <h3 className="text-h3 font-heading mb-lg text-white">Filters</h3>
        <div className="space-y-lg">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Search</label>
            <input
              type="text"
              id="search"
              placeholder="e.g., Toyota Camry"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={formInputStyles}
            />
          </div>
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Make</label>
            <input
              type="text"
              id="make"
              name="make"
              placeholder="e.g., Ford"
              value={filters.make}
              onChange={handleFilterChange}
              className={formInputStyles}
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-neutral-metallic-silver/80 mb-xs">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              placeholder="e.g., 2023"
              value={filters.year}
              onChange={handleFilterChange}
              className={formInputStyles}
            />
          </div>
        </div>
      </aside>

      <main className="w-full md:w-3/4">
        {error && <div className="text-red-400 text-center p-md bg-red-900/20 rounded-lg">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
          {images.map(image => (
            <div key={image.id} className="group overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9 bg-glass">
              <img
                src={image.url}
                alt={image.alt_text || `${image.vehicles.year} ${image.vehicles.make} ${image.vehicles.model}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {loading && <div className="text-center text-neutral-metallic-silver mt-lg">Loading...</div>}

        {!loading && hasMore && (
          <div className="text-center mt-lg">
            <button
              onClick={handleLoadMore}
              className="bg-primary-gradient hover:opacity-90 text-white font-bold py-sm px-lg rounded-lg transition-opacity"
            >
              Load More Images
            </button>
          </div>
        )}
        {!loading && !hasMore && images.length > 0 && (
          <div className="text-center text-neutral-metallic-silver/70 mt-lg py-md">End of results.</div>
        )}
        {!loading && images.length === 0 && !error && (
          <div className="text-center text-neutral-metallic-silver/80 mt-lg p-lg bg-glass rounded-lg">No images found for the selected criteria.</div>
        )}
      </main>
    </div>
  );
};

export default FullGallery;
