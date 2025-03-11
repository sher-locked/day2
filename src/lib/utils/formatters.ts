/**
 * Format number with commas
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Format currency to appropriate decimal places
 * @param num The number to format
 * @param currency The currency code ('USD' or 'INR')
 * @param decimals Optional number of decimal places (defaults to 5 for USD, 2 for INR)
 */
export function formatCurrency(
  num: number | undefined, 
  currency: 'USD' | 'INR',
  decimals?: number
): string {
  if (num === undefined) return currency === 'USD' ? '$0.00' : '₹0.00';
  
  // Default decimal places: 5 for USD, 2 for INR
  const decimalPlaces = decimals !== undefined 
    ? decimals 
    : (currency === 'USD' ? 5 : 2);
  
  return currency === 'USD' 
    ? `$${num.toFixed(decimalPlaces)}` 
    : `₹${num.toFixed(decimalPlaces)}`;
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