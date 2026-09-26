/**
 * Format a date string into readable text
 * @param {string|Date} dateString
 * @param {boolean} includeTime
 * @returns {string} e.g. "Sep 25, 2026, 03:30 PM"
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }
      : {}),
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default formatDate;
