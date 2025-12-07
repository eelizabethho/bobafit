// Helper functions for formatting nutrition data
// made these after duplicating rounding logic a bunch

export function roundToDecimal(value: number, decimals: number = 1): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// not really using this but might need it later
export function formatNutritionValue(value: number, unit: string = 'g'): string {
  if (value === 0) return '0' + unit;
  return roundToDecimal(value, 1) + unit;
}

// convert sodium grams to mg
export function sodiumToMg(grams: number): number {
  return Math.round(grams * 1000);
}

// check if value should be displayed
export function shouldShowValue(value: number | undefined): boolean {
  if (value === undefined) return false;
  return value > 0;
}
