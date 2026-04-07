/**
 * Format currency based on the selected currency type
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (AED, USD, EUR, etc.)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'AED'): string {
  const currencyMap: Record<string, { symbol: string; position: 'before' | 'after' }> = {
    AED: { symbol: 'AED', position: 'before' },
    USD: { symbol: '$', position: 'before' },
    EUR: { symbol: '€', position: 'before' },
    GBP: { symbol: '£', position: 'before' },
    RUB: { symbol: '₽', position: 'after' },
    SAR: { symbol: 'SAR', position: 'before' },
    QAR: { symbol: 'QAR', position: 'before' },
  };

  const config = currencyMap[currency] || currencyMap.AED;
  const formattedAmount = amount.toFixed(2);

  if (config.position === 'before') {
    return `${config.symbol} ${formattedAmount}`;
  } else {
    return `${formattedAmount} ${config.symbol}`;
  }
}
