/**
 * Format number with commas
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Format currency to appropriate decimal places
 * USD: 5 decimal places
 * INR: 2 decimal places
 */
export function formatCurrency(num: number | undefined, currency: 'USD' | 'INR'): string {
  if (num === undefined) return currency === 'USD' ? '$0.00000' : '₹0.00';
  return currency === 'USD' 
    ? `$${num.toFixed(5)}` 
    : `₹${num.toFixed(2)}`;
}

/**
 * Format time in mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format JSON with indentation
 */
export function formatJSON(json: unknown): string {
  try {
    return JSON.stringify(json, null, 2);
  } catch (_) {
    return 'Error formatting JSON';
  }
} 