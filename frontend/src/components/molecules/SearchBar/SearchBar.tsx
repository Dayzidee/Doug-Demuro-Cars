import { Search } from 'lucide-react';

const SearchBar = () => {
  const selectStyles = "w-full p-3 rounded-lg bg-backgrounds-card text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 appearance-none";

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="p-4 bg-glass border border-glass rounded-xl shadow-2xl backdrop-blur-md">
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

          <button type="submit" className="w-full p-3 rounded-lg bg-primary-gradient text-white font-bold hover:opacity-90 transition-opacity col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-center space-x-2 transform hover:scale-105">
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
