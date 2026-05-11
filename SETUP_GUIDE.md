# ServiceHub - Search Nearby Services Platform

A modern, production-ready Angular marketplace application for discovering and booking local services like electricians, plumbers, tutors, and more.

## 🎯 Features

### Core Features
- ✅ **Location-Based Search** - Find services near you using GPS integration
- ✅ **Service Filtering** - Filter by category, price, rating, and distance
- ✅ **Real-Time Updates** - WebSocket integration for live notifications
- ✅ **User Authentication** - Secure login/registration with JWT tokens
- ✅ **Booking System** - Complete booking workflow with payments
- ✅ **Chat System** - Real-time communication between customers and providers
- ✅ **Rating & Reviews** - Rate and review services

### Technical Features
- ✅ **Angular 21** - Latest Angular with standalone components
- ✅ **Material Design** - Angular Material UI components
- ✅ **Multiple Themes** - Dark, Light, Blue, Red themes with dynamic switching
- ✅ **Responsive Design** - Mobile-first PWA-enabled application
- ✅ **State Management** - NgRx for complex state management
- ✅ **Swiper Carousel** - Professional carousel for service listings
- ✅ **Google Maps** - Location-based services integration
- ✅ **Skeleton Loaders** - Enhanced loading states
- ✅ **Error Handling** - Comprehensive error management
- ✅ **HTTP Interceptors** - Auth token and error handling

## 📂 Project Structure

```
src/app/
├── core/                          # Singleton services and global logic
│   ├── services/
│   │   ├── api.service.ts        # API communication
│   │   ├── auth.service.ts       # Authentication & authorization
│   │   ├── location.service.ts   # GPS & Google Maps integration
│   │   ├── storage.service.ts    # LocalStorage management
│   │   ├── theme.service.ts      # Theme switching
│   │   └── websocket.service.ts  # WebSocket/Socket.io
│   ├── interceptors/
│   │   ├── auth.interceptor.ts   # JWT token injection
│   │   └── error.interceptor.ts  # Error handling
│   ├── guards/
│   │   ├── auth.guard.ts         # Route protection
│   │   └── role.guard.ts         # Role-based access
│   └── models/
│       ├── user.model.ts
│       ├── service.model.ts
│       ├── booking.model.ts
│       └── location.model.ts
├── shared/                        # Reusable components & utilities
│   ├── components/
│   │   ├── navbar/               # Navigation bar
│   │   ├── footer/               # Footer
│   │   ├── service-card/         # Service listing card
│   │   ├── loader/               # Loading skeleton
│   │   └── rating/               # Rating component
│   ├── directives/
│   ├── pipes/
│   └── utils/
├── features/                      # Feature modules
│   ├── home/                      # Home page
│   │   ├── pages/
│   │   └── components/
│   ├── search/                    # ⭐ Main search module
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   │   ├── search.actions.ts
│   │   │   ├── search.reducer.ts
│   │   │   ├── search.effects.ts
│   │   │   └── search.selectors.ts
│   │   └── models/
│   ├── service-details/           # Service detail page
│   ├── booking/                   # Booking management
│   ├── user-dashboard/            # User dashboard
│   ├── provider-dashboard/        # Provider dashboard
│   └── chat/                      # Chat/messaging
├── layout/
│   ├── main-layout/               # Main layout wrapper
│   └── auth-layout/               # Auth pages layout
├── app.config.ts                  # App configuration
├── app.routes.ts                  # Routing configuration
└── main.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm 8+
- Angular CLI 21+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  socketUrl: 'http://localhost:3000'
};
```

4. **Start development server**
```bash
npm start
```

Navigate to `http://localhost:4200`

## 🎨 Theme System

### Available Themes
1. **Light** - Default light theme
2. **Dark** - Dark mode with adjusted colors
3. **Blue** - Professional blue theme
4. **Red** - Vibrant red theme

### Switching Themes
Themes can be switched via the theme menu in the navbar or programmatically:

```typescript
import { ThemeService } from '@app/core/services/theme.service';

constructor(private themeService: ThemeService) {}

toggleTheme(themeName: 'light' | 'dark' | 'blue' | 'red') {
  this.themeService.setTheme(themeName);
}
```

### Customizing Themes
Edit `src/assets/themes/_variables.scss` and `src/assets/themes/_themes.scss`

## 🔐 Authentication

### Login/Registration
```typescript
// Login
this.authService.login(email, password).subscribe(
  (response) => {
    // Token stored automatically
    // User redirected to dashboard
  }
);

// Register
this.authService.register(userData).subscribe(
  (response) => {
    // New user created
  }
);
```

### JWT Token Handling
- Tokens automatically injected in requests via `AuthInterceptor`
- Automatic token refresh on expiry
- Logout clears all auth data

## 🗺️ Location Services

### Getting User Location
```typescript
import { LocationService } from '@app/core/services/location.service';

constructor(private locationService: LocationService) {}

ngOnInit() {
  this.locationService.getCurrentLocation().subscribe(
    (location) => {
      console.log(location.latitude, location.longitude);
    }
  );
}
```

### Nearby Services Search
```typescript
// Search services within 5km radius
this.apiService.searchNearbyServices(
  lat, 
  lng, 
  5,  // radius in km
  'electrician'  // optional: category
).subscribe(services => {
  // Handle services
});
```

## 📊 State Management (NgRx)

### Search State Example
```typescript
// Dispatch action
this.store.dispatch(SearchActions.searchServices({ 
  filter: { category: ['electrician'], maxPrice: 1000 } 
}));

// Select state
this.services$ = this.store.select(selectServices);
this.isLoading$ = this.store.select(selectIsLoading);
this.error$ = this.store.select(selectError);
```

## 💬 Real-Time Chat

### WebSocket Integration
```typescript
import { WebSocketService } from '@app/core/services/websocket.service';

constructor(private wsService: WebSocketService) {}

ngOnInit() {
  // Connect to WebSocket
  this.wsService.connect(userId);
  
  // Listen for messages
  this.wsService.onMessageReceived().subscribe(message => {
    // Handle message
  });
  
  // Send message
  this.wsService.sendMessage({ 
    bookingId, 
    message: 'Your message' 
  });
}
```

## 🎯 API Integration

### API Endpoints
Base URL: `/api`

**Auth:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token

**Services:**
- `GET /services` - List all services
- `GET /services/nearby` - Get nearby services
- `GET /services/:id` - Get service details
- `POST /services` - Create service (provider)
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

**Bookings:**
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

**Messages:**
- `POST /messages` - Send message
- `GET /messages/:bookingId` - Get chat messages

## 📱 Progressive Web App (PWA)

To enable PWA capabilities:

1. **Generate service worker**
```bash
ng generate service-worker
```

2. **Update angular.json** to include service worker in production build

3. **Configure manifest.json** for app installation

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run e2e

# Build for production
npm run build
```

## 📦 Build for Production

```bash
npm run build

# Output in dist/marketplace
```

## 🌐 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist/marketplace
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist/marketplace /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### Environment Setup
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  googleMapsApiKey: 'YOUR_API_KEY',
  // ... other config
};
```

### Material Theme Customization
```scss
// src/styles.scss
@import '@angular/material/prebuilt-themes/indigo-pink.css';
@import 'src/assets/themes/_themes.scss';
```

## 📚 Dependencies

- `@angular/material@^21.2.0` - UI components
- `@ngrx/store@^18.0.0` - State management
- `socket.io-client` - Real-time communication
- `swiper` - Carousel component
- `axios` - HTTP client
- `@angular/google-maps` - Maps integration

## 🐛 Troubleshooting

### Common Issues

**Issue: Services not loading**
- Check API endpoint configuration
- Verify network requests in browser DevTools
- Check authentication token validity

**Issue: Location permission denied**
- Check browser location permissions
- Ensure HTTPS in production (required for geolocation)
- Verify LocationService configuration

**Issue: Material icons not showing**
- Verify Material icons are included in index.html
- Clear browser cache and rebuild

## 📖 Additional Resources

- [Angular Documentation](https://angular.io)
- [Angular Material](https://material.angular.io)
- [NgRx Documentation](https://ngrx.io)
- [Socket.io Documentation](https://socket.io)
- [Google Maps API](https://developers.google.com/maps)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For support, please contact: support@servicehub.com

---

**Last Updated:** May 2026
**Version:** 1.0.0
