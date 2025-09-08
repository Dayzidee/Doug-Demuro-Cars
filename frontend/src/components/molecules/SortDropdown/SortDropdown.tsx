import React from "react";
import { useFilterStore } from "../../../hooks/useFilterStore";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest First" },
  { value: "year_asc", label: "Year: Oldest First" },
  { value: "mileage_asc", label: "Mileage: Low to High" },
  { value: "mileage_desc", label: "Mileage: High to Low" },
];

const SortDropdown: React.FC = () => {
  const { sortOrder, setSortOrder } = useFilterStore();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="relative inline-block w-64">
      <select
        value={sortOrder}
        onChange={handleSortChange}
        className="w-full appearance-none bg-backgrounds-card border border-glass text-white py-sm pl-md pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-colors cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-primary-deep-blue text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-metallic-silver">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default SortDropdown;
