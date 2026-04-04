/**
 * Shared formatting utilities
 */

export const formatCurrency = (n) =>
  n != null ? `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '—';

export const formatCurrencyShort = (n) =>
  n != null ? `₦${Math.abs(Number(n)).toLocaleString()}` : '₦0';

export const formatDate = (d, options) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', options || { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};
