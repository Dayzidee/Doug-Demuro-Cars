import React from 'react';
import { useFilterStore } from '../../../hooks/useFilterStore';
import FilterGroup from '../../molecules/FilterGroup/FilterGroup';
import RangeSlider from '../../molecules/RangeSlider/RangeSlider';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api';

interface FilterSidebarProps {
  facets: any;
  isLoading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ facets, isLoading }) => {
  const {
    make, model, bodyTypes, fuelTypes, priceRange, yearRange,
    setMake, setModel, toggleBodyType, toggleFuelType, setPriceRange, setYearRange, resetFilters
  } = useFilterStore();

  const { data: filterOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const response = await apiClient.get('/filters/options');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const makeOptions = filterOptions?.makes.map((m: string) => ({ value: m, label: m })) || [];
  const modelOptions = filterOptions?.models.map((m: string) => ({ value: m, label: m })) || [];
  const bodyTypeOptions = filterOptions?.bodyTypes.map((bt: string) => ({ value: bt, label: bt })) || [];
  const fuelTypeOptions = filterOptions?.fuelTypes.map((ft: string) => ({ value: ft, label: ft })) || [];

  return (
    <aside className={`w-full lg:w-1/4 p-6 bg-white rounded-lg shadow-lg h-fit transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold font-heading text-charcoal">Filters</h2>
        <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-charcoal transition-colors" disabled={isLoading || isLoadingOptions}>
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {isLoadingOptions ? <p>Loading filters...</p> : (
          <>
            <FilterGroup
              title="Make"
              options={makeOptions}
              selectedValues={make ? [make] : []}
              onChange={(value) => setMake(make === value ? '' : value)}
              counts={facets?.make}
            />
            <hr />
            <FilterGroup
              title="Model"
              options={modelOptions}
              selectedValues={model ? [model] : []}
              onChange={(value) => setModel(model === value ? '' : value)}
              counts={facets?.model}
            />
            <hr />
            <FilterGroup
              title="Body Type"
              options={bodyTypeOptions}
              selectedValues={bodyTypes}
              onChange={toggleBodyType}
              counts={facets?.bodyType}
            />
            <hr />
            <FilterGroup
              title="Fuel Type"
              options={fuelTypeOptions}
              selectedValues={fuelTypes}
              onChange={toggleFuelType}
              counts={facets?.fuelType}
            />
          </>
        )}
        <hr />
        <div>
          <h3 className="font-semibold mb-4 text-charcoal">Price Range</h3>
          <RangeSlider
            min={0}
            max={200000}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
        <hr />
        <div>
          <h3 className="font-semibold mb-4 text-charcoal">Year</h3>
           <RangeSlider
            min={2000}
            max={new Date().getFullYear()}
            value={yearRange}
            onChange={(value) => setYearRange(value as [number, number])}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
