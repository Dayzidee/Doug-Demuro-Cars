import React from 'react';

const SearchBar = () => {
  const selectStyles = "w-full p-3 rounded-lg bg-gray-700/50 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-silver/50";

  return (
    <div className="w-full max-w-5xl p-4 bg-glass-bg border border-glass-border rounded-xl shadow-lg backdrop-blur-sm mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* Placeholder for Make dropdown */}
        <select className={selectStyles}>
          <option>Any Make</option>
          <option>Toyota</option>
          <option>Honda</option>
          <option>Ford</option>
        </select>

        {/* Placeholder for Model dropdown */}
        <select className={selectStyles}>
          <option>Any Model</option>
        </select>

        {/* Placeholder for Year Range dropdown */}
        <select className={selectStyles}>
          <option>Any Year</option>
        </select>

        {/* Placeholder for Price Range dropdown */}
        <select className={selectStyles}>
          <option>Any Price</option>
        </select>

        <button type="submit" className="w-full p-3 rounded-lg bg-primary-gradient text-white font-bold hover:opacity-90 transition-opacity col-span-1 md:col-span-2 lg:col-span-1">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
