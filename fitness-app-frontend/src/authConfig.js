import { AuthContext, AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce"

// authConfig.js - Updated to use environment variables
export const authConfig = {
  clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID || 'oauth2-pkce-client',
  authorizationEndpoint: import.meta.env.VITE_OAUTH2_AUTH_ENDPOINT || 'http://127.0.0.1:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: import.meta.env.VITE_OAUTH2_TOKEN_ENDPOINT || 'http://127.0.0.1:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: import.meta.env.VITE_OAUTH2_REDIRECT_URI || 'http://localhost:5173',
  scope: import.meta.env.VITE_OAUTH2_SCOPE || 'openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
}

// Optional: API configuration for your frontend API calls
export const apiConfig = {
  gateway: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  userService: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081',
  activityService: import.meta.env.VITE_ACTIVITY_SERVICE_URL || 'http://localhost:8082',
  aiService: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8083',
}

// Helper function to get full API URLs
export const getApiUrl = (service, endpoint) => {
  const baseUrl = apiConfig[service] || apiConfig.gateway
  return `${baseUrl}${endpoint}`
}

// Example usage:
// const userProfileUrl = getApiUrl('gateway', '/api/users/profile')
// const activitiesUrl = getApiUrl('gateway', '/api/activities')
