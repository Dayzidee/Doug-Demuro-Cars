import React from 'react';

const SearchBar = () => {
  const selectStyles = "w-full p-sm rounded-lg bg-glass text-white border border-glass focus:outline-none focus:ring-2 focus:ring-secondary-golden-yellow appearance-none";

  return (
    <div className="w-full max-w-5xl p-md bg-glass/80 border border-glass rounded-xl shadow-lg backdrop-blur-md mt-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-md items-center">
        <select className={selectStyles}>
          <option>Any Make</option>
          <option>Toyota</option>
          <option>Honda</option>
          <option>Ford</option>
        </select>
        <select className={selectStyles}>
          <option>Any Model</option>
        </select>
        <select className={selectStyles}>
          <option>Any Year</option>
        </select>
        <select className={selectStyles}>
          <option>Any Price</option>
        </select>
        <button type="submit" className="w-full p-sm rounded-lg bg-primary-gradient text-white font-bold hover:opacity-90 transition-opacity col-span-1 md:col-span-2 lg:col-span-1">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
