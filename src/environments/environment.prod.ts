// Environment configuration for production
export const environment = {
  production: true,
  apiUrl: 'https://api.marketplace.com/api',
  socketUrl: 'https://api.marketplace.com',
  logLevel: 'error',
  enableDebugTools: false,
  cacheExpiration: 3600000, // 1 hour in milliseconds
  requestTimeout: 30000, // 30 seconds
  features: {
    enableWebSocket: true,
    enablePushNotifications: true,
    enableServiceWorker: true,
    enableOfflineMode: true
  }
};
