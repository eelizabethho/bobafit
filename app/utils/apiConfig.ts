// API endpoint config
// might move this to env vars later but works for now

const getApiEndpoint = (): string => {
  // Check localStorage first for testing
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('api_endpoint');
    if (stored) {
      return stored;
    }
  }
  
  // Use env var or default to local
  return process.env.NEXT_PUBLIC_API_ENDPOINT || '';
};

export const API_CONFIG = {
  endpoint: getApiEndpoint(),
  timeout: 10000,
  retryAttempts: 2,
};

// Build URL for API calls
export function buildNutritionUrl(food: string): string {
  const base = API_CONFIG.endpoint || '/api/nutrition';
  // Check if base already has query params
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}food=${encodeURIComponent(food)}`;
}
