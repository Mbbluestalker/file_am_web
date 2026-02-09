/**
 * SYSTEM EVALUATION COMPONENT
 *
 * Displays system-generated tax evaluations with status badges
 */
const SystemEvaluation = ({ evaluations }) => {
  const getBadgeClasses = (status) => {
    switch (status) {
      case 'Not Required':
        return 'bg-green-50 text-green-600';
      case 'Not Eligible':
        return 'bg-gray-100 text-gray-600';
      case 'Required':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-blue-50 rounded-2xl !p-6">
      <h3 className="text-lg font-bold text-gray-900 !mb-6">System Evaluation</h3>

      <div className="space-y-4">
        {evaluations.map((evaluation, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{evaluation.label}</span>
            <span className={`!px-4 !py-1.5 rounded-lg text-sm font-medium ${getBadgeClasses(evaluation.status)}`}>
              {evaluation.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemEvaluation;
