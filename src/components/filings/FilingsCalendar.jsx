const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const FilingsCalendar = ({ currentMonth, onNavigateMonth, markedDates = {}, summary }) => {
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const dotColor = (mark) =>
    mark === 'submitted' ? 'bg-green-500'
      : mark === 'overdue' ? 'bg-red-500'
      : mark === 'in-progress' ? 'bg-blue-500'
      : null;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => onNavigateMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => onNavigateMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 px-6 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 px-6 pb-4">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const mark = markedDates[day];
          const isToday = mark === 'today';
          const dc = dotColor(mark);
          return (
            <div key={day} className="flex flex-col items-center py-1">
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${isToday ? 'border-2 border-orange-400 text-orange-600 font-semibold' : 'border border-gray-100 text-gray-700 hover:bg-gray-50'}`}>
                {day}
              </div>
              {dc ? <div className={`w-1.5 h-1.5 rounded-full ${dc} mt-0.5`} /> : <div className="h-2" />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-900 px-6 py-4 flex items-center gap-8">
        {[
          { color: 'bg-green-500', label: 'Submitted', key: 'submitted' },
          { color: 'bg-red-500', label: 'Overdue', key: 'overdue' },
          { color: 'bg-blue-500', label: 'In Progress', key: 'inProgress' },
          { color: 'bg-orange-400', label: 'Today', key: 'today' },
        ].map(({ color, label, key }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
            <div>
              <span className="text-xs text-gray-300">{label}</span>
              {summary?.[key] && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-white">{summary[key].count}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{summary[key].days} days</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilingsCalendar;
