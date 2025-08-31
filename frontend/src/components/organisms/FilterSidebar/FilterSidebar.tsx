import React from 'react';
import { useFilterStore } from '../../../hooks/useFilterStore';
import FilterGroup from '../../molecules/FilterGroup/FilterGroup';

// In a real app, these options would likely come from an API
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

const FilterSidebar = () => {
  const { bodyTypes, fuelTypes, toggleBodyType, toggleFuelType, resetFilters } = useFilterStore();

  return (
    <aside className="w-full lg:w-1/4 p-6 bg-white rounded-lg shadow-lg h-fit">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold font-heading text-charcoal">Filters</h2>
        <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-charcoal transition-colors">
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        <FilterGroup
          title="Body Type"
          options={bodyTypeOptions}
          selectedValues={bodyTypes}
          onChange={toggleBodyType}
        />
        <hr />
        <FilterGroup
          title="Fuel Type"
          options={fuelTypeOptions}
          selectedValues={fuelTypes}
          onChange={toggleFuelType}
        />
      </div>
    </aside>
  );
};

export default FilterSidebar;
