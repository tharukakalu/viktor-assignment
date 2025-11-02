
const getApiBaseUrl = (): string => {
  // Check for environment variable
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Fallback for production builds
  return 'https://cms.viktor.ai';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  defaultPageSize: 8,
  debounceDelay: 500,
};