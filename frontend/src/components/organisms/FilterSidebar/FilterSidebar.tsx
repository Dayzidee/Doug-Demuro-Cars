import React from 'react';
import { useFilterStore } from '../../../hooks/useFilterStore';
import FilterGroup from '../../molecules/FilterGroup/FilterGroup';
import RangeSlider from '../../molecules/RangeSlider/RangeSlider';

const bodyTypeOptions = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Coupe', label: 'Coupe' },
];

const fuelTypeOptions = [
  { value: 'Gasoline', label: 'Gasoline' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Diesel', label: 'Diesel' },
];

interface FilterSidebarProps {
  facets: any;
  isLoading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ facets, isLoading }) => {
  const {
    make, setMake,
    model, setModel,
    bodyTypes, fuelTypes, priceRange, yearRange,
    toggleBodyType, toggleFuelType, setPriceRange, setYearRange, resetFilters
  } = useFilterStore();

  const inputStyles = "w-full bg-backgrounds-card p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";

  return (
    <aside className={`w-full lg:w-80 xl:w-96 p-lg bg-glass border border-glass rounded-xl shadow-2xl backdrop-blur-md h-fit transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-lg border-b border-glass pb-md">
        <h2 className="text-h3 font-heading text-white">Filters</h2>
        <button onClick={resetFilters} className="text-sm text-neutral-metallic-silver/80 hover:text-white transition-colors" disabled={isLoading}>
          Reset All
        </button>
      </div>

      <div className="space-y-lg">
        <div>
          <label htmlFor="make-filter" className="font-heading text-lg mb-sm text-white block">Make</label>
          <input
            id="make-filter"
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={inputStyles}
            placeholder="e.g., Toyota"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="model-filter" className="font-heading text-lg mb-sm text-white block">Model</label>
          <input
            id="model-filter"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={inputStyles}
            placeholder="e.g., Camry"
            disabled={isLoading}
          />
        </div>

        <FilterGroup
          title="Body Type"
          options={bodyTypeOptions}
          selectedValues={bodyTypes}
          onChange={toggleBodyType}
          counts={facets?.bodyType}
        />

        <FilterGroup
          title="Fuel Type"
          options={fuelTypeOptions}
          selectedValues={fuelTypes}
          onChange={toggleFuelType}
          counts={facets?.fuelType}
        />

        <div className="pt-md border-t border-glass">
          <h3 className="font-heading text-lg my-md text-white">Price Range</h3>
          <RangeSlider
            min={0}
            max={200000}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            formatTooltip={(value) => `$${value.toLocaleString()}`}
          />
          <div className="flex justify-between text-sm text-neutral-metallic-silver/80 mt-sm">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-md border-t border-glass">
          <h3 className="font-heading text-lg my-md text-white">Year</h3>
           <RangeSlider
            min={2000}
            max={new Date().getFullYear()}
            value={yearRange}
            onChange={(value) => setYearRange(value as [number, number])}
            formatTooltip={(value) => value}
          />
          <div className="flex justify-between text-sm text-neutral-metallic-silver/80 mt-sm">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
