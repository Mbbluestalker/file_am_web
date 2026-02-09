/**
 * ALERT BANNER COMPONENT
 *
 * Displays warning/info banners with icon
 */
const AlertBanner = ({ message, type = 'warning' }) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
        };
      case 'success':
        return {
          container: 'bg-green-50 border border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
        };
      default:
        return {
          container: 'bg-gray-50 border border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.container} rounded-xl !px-4 !py-3 flex items-center !gap-3`}>
      <svg className={`w-5 h-5 ${styles.icon} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span className={`text-sm ${styles.text}`}>{message}</span>
    </div>
  );
};

export default AlertBanner;
