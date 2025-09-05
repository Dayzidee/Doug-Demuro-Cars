import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (value: string) => void;
  counts?: { [key: string]: number };
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selectedValues, onChange, counts }) => {
  return (
    <div>
      <h3 className="font-heading text-lg mb-sm text-neutral-metallic-silver">{title}</h3>
      <div className="space-y-sm">
        {options.map((option) => (
          <label key={option.value} className="flex items-center justify-between cursor-pointer text-neutral-metallic-silver/80 hover:text-neutral-metallic-silver transition-colors">
            <div className="flex items-center space-x-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-glass bg-glass text-secondary-golden-yellow focus:ring-secondary-golden-yellow focus:ring-offset-0"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </div>
            {counts && (
              <span className="text-xs text-primary-deep-blue bg-secondary-golden-yellow px-sm py-xs rounded-full font-bold">
                {counts[option.value] || 0}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
