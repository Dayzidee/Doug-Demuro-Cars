import React, { useState, useEffect, useCallback } from 'react';

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

  // Debounce the search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

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

      const newImages = await response.json();

      setImages(prevImages => isNewSearch ? newImages : [...prevImages, ...newImages]);
      setHasMore(newImages.length === PAGE_SIZE);

    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedSearchTerm]); // Dependencies for the fetch function

  // Effect to trigger a new search when filters or debounced search term change
  useEffect(() => {
    setPage(1); // Reset page to 1 for new searches
    fetchImages(true);
  }, [filters, debouncedSearchTerm]); // Note: fetchImages is not a dependency here to avoid loops

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
  }, [page]); // Note: fetchImages is not a dependency here

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 p-4 bg-gray-800 rounded-lg self-start">
        <h3 className="text-xl font-bold mb-4 text-white">Filters</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="e.g., Toyota Camry"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-300 mb-1">Make</label>
            <input
              type="text"
              id="make"
              name="make"
              placeholder="e.g., Ford"
              value={filters.make}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              placeholder="e.g., 2023"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500"
            />
          </div>
        </div>
      </aside>

      <main className="w-full md:w-3/4">
        {error && <div className="text-red-500 text-center p-4 bg-red-900/20 rounded-lg">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="group overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9">
              <img
                src={image.url}
                alt={image.alt_text || `${image.vehicles.year} ${image.vehicles.make} ${image.vehicles.model}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {loading && <div className="text-center text-white mt-8">Loading...</div>}

        {!loading && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Load More Images
            </button>
          </div>
        )}
        {!loading && !hasMore && images.length > 0 && (
          <div className="text-center text-gray-500 mt-8 py-4">End of results.</div>
        )}
        {!loading && images.length === 0 && !error && (
          <div className="text-center text-gray-400 mt-8 p-8 bg-gray-800 rounded-lg">No images found for the selected criteria.</div>
        )}
      </main>
    </div>
  );
};

export default FullGallery;
