/**
 * SEARCH BAR COMPONENT
 *
 * Reusable search input with icon
 */
const SearchBar = ({ placeholder = 'Search...', value, onChange }) => {
  return (
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center !pl-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full !pl-12 !pr-4 !py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
      />
    </div>
  );
};

export default SearchBar;
