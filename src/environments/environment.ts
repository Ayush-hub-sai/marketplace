// Environment configuration for development
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  logLevel: 'debug',
  enableDebugTools: true,
  cacheExpiration: 300000, // 5 minutes in milliseconds
  requestTimeout: 60000, // 60 seconds
  features: {
    enableWebSocket: true,
    enablePushNotifications: false,
    enableServiceWorker: false,
    enableOfflineMode: false
  }
};
