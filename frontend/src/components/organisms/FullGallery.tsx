import { useState, useEffect, useMemo } from 'react';
import { mockVehicleData } from '../../data/mockVehicleData';

interface DisplayImage {
  id: string;
  url: string;
  type: 'exterior' | 'interior';
  make: string;
  model: string;
  year: number;
}

const FullGallery: React.FC = () => {
  const [filters, setFilters] = useState({ make: '', year: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const allImages: DisplayImage[] = useMemo(() => {
    return mockVehicleData.flatMap(vehicle =>
      vehicle.media.map(mediaItem => ({
        ...mediaItem,
        id: `${vehicle.id}-${mediaItem.url}`,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
      }))
    );
  }, []);

  const filteredImages = useMemo(() => {
    return allImages.filter(image => {
      const searchMatch = debouncedSearchTerm ? `${image.year} ${image.make} ${image.model}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) : true;
      const makeMatch = filters.make ? image.make.toLowerCase().includes(filters.make.toLowerCase()) : true;
      const yearMatch = filters.year ? image.year.toString() === filters.year : true;
      return searchMatch && makeMatch && yearMatch;
    });
  }, [allImages, filters, debouncedSearchTerm]);

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
          {filteredImages.map(image => (
            <div key={image.id} className="group overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9 bg-glass">
              <img
                src={image.url}
                alt={`${image.year} ${image.make} ${image.model}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center text-neutral-metallic-silver/80 mt-lg p-lg bg-glass rounded-lg">No images found for the selected criteria.</div>
        )}
      </main>
    </div>
  );
};

export default FullGallery;
