const HealthCategoryGrid = ({ categories, currentScore = 0 }) => {
  const activeCategory = currentScore >= 80 ? 'Healthy' : currentScore >= 60 ? 'Stable' : currentScore >= 40 ? 'At Risk' : 'Failing';

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => {
        const isActive = cat.label === activeCategory;
        return (
          <div key={cat.label} className={`rounded-xl p-5 ${isActive ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`} />
              <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>{cat.label}</span>
            </div>
            <p className={`text-xs mb-3 ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>{cat.range}</p>
            <p className={`text-xs leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{cat.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HealthCategoryGrid;
