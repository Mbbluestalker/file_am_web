/**
 * TEXT INPUT COMPONENT
 *
 * Reusable text input field with label
 */
const TextInput = ({ label, value, onChange, placeholder, disabled = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 !mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full !px-4 !py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
};

export default TextInput;
