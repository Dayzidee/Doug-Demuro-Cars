import React from 'react';
import { useFilterStore } from '../../../hooks/useFilterStore';

const sortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'year_desc', label: 'Year: Newest' },
  { value: 'mileage_asc', label: 'Mileage: Lowest' },
];

const SortDropdown = () => {
  const { sortOrder, setSortOrder } = useFilterStore();

  return (
    <div>
      <label htmlFor="sort-order" className="sr-only">Sort by</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="bg-glass border border-glass rounded-lg p-sm text-neutral-metallic-silver focus:ring-secondary-golden-yellow focus:border-secondary-golden-yellow appearance-none"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value} className="bg-primary-deep-blue">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
