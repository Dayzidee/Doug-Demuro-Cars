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

  const inputStyles = "w-full bg-glass border-b-2 border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:border-secondary-golden-yellow transition-colors";

  return (
    <aside className={`w-full lg:w-80 xl:w-96 p-lg bg-glass border border-glass rounded-xl shadow-lg h-fit transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-lg border-b border-glass pb-md">
        <h2 className="text-h3 font-heading text-neutral-metallic-silver">Filters</h2>
        <button onClick={resetFilters} className="text-sm text-neutral-metallic-silver/80 hover:text-white transition-colors" disabled={isLoading}>
          Reset All
        </button>
      </div>

      <div className="space-y-lg">
        <div>
          <h3 className="font-heading text-lg mb-sm text-neutral-metallic-silver">Make</h3>
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
        <hr className="border-glass" />
        <div>
          <h3 className="font-heading text-lg mb-sm text-neutral-metallic-silver">Model</h3>
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
        <hr className="border-glass" />
        <FilterGroup
          title="Body Type"
          options={bodyTypeOptions}
          selectedValues={bodyTypes}
          onChange={toggleBodyType}
          counts={facets?.bodyType}
        />
        <hr className="border-glass" />
        <FilterGroup
          title="Fuel Type"
          options={fuelTypeOptions}
          selectedValues={fuelTypes}
          onChange={toggleFuelType}
          counts={facets?.fuelType}
        />
        <hr className="border-glass" />
        <div>
          <h3 className="font-heading text-lg mb-md text-neutral-metallic-silver">Price Range</h3>
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
        <hr className="border-glass" />
        <div>
          <h3 className="font-heading text-lg mb-md text-neutral-metallic-silver">Year</h3>
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
