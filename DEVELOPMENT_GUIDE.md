# ServiceHub Development Guide

## Project Overview

ServiceHub is a modern, production-ready Angular marketplace platform for booking local services like electricians, plumbers, tutors, and more. It features a responsive design, multiple themes, real-time updates, and a comprehensive booking system.

## Technology Stack

### Frontend
- **Framework**: Angular 21 (Standalone Components)
- **State Management**: NgRx
- **UI Library**: Angular Material
- **Styling**: SCSS with Theme System
- **HTTP Client**: Axios
- **Real-time**: Socket.io
- **Carousel**: Swiper
- **Maps**: Google Maps API

### Architecture
- Core Services Layer (API, Auth, Location, WebSocket, Theme, Storage)
- Shared Components & Utilities
- Feature Modules with State Management
- Route Guards for Security
- HTTP Interceptors for Auth & Errors
- Material Design with Custom Theming

## Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm 8+ (or yarn/pnpm)
- Angular CLI 21+
- Git

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd marketplace
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
};

export const environment_prod = {
  production: true,
  apiUrl: 'https://api.servicehub.com/api',
  socketUrl: 'https://api.servicehub.com',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
};
```

4. **Run Development Server**
```bash
npm start
```

Navigate to `http://localhost:4200`

## Development Workflow

### File Structure
```
src/app/
├── core/                    # Singleton services
│   ├── services/           # API, Auth, Location, WebSocket
│   ├── interceptors/       # HTTP interceptors
│   ├── guards/             # Route guards
│   └── models/             # Data models
├── shared/                 # Reusable components
│   ├── components/         # Navbar, Footer, Cards
│   ├── directives/
│   ├── pipes/
│   └── utils/
├── features/               # Feature modules
│   ├── home/              # Home page
│   ├── search/            # Search with NgRx
│   ├── auth/              # Login/Register
│   └── ...
├── layout/                # Layout components
├── app.routes.ts          # Routing
└── app.config.ts          # App configuration
```

### Adding a New Feature

1. **Create Feature Directory**
```bash
mkdir -p src/app/features/new-feature/{pages,components,services,store}
```

2. **Create Component**
```typescript
// new-feature.component.ts
import { Component, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-feature',
  standalone: true,
  imports: [CommonModule],
  template: `<div>New Feature</div>`,
  styles: []
})
export class NewFeatureComponent {}
```

3. **Add Route**
```typescript
// app.routes.ts
{
  path: 'new-feature',
  component: NewFeatureComponent,
  canActivate: [AuthGuard]
}
```

### State Management Pattern

1. **Create Actions**
```typescript
// feature.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadItems = createAction(
  '[Feature] Load Items'
);

export const loadItemsSuccess = createAction(
  '[Feature] Load Items Success',
  props<{ items: any[] }>()
);
```

2. **Create Reducer**
```typescript
// feature.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as FeatureActions from './feature.actions';

export const featureReducer = createReducer(
  initialState,
  on(FeatureActions.loadItems, (state) => ({ ...state }))
);
```

3. **Create Effects**
```typescript
// feature.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class FeatureEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.loadItems),
      switchMap(() => /* API call */)
    )
  );
}
```

## Themes

### Available Themes
- **Light**: Default light theme
- **Dark**: Dark mode
- **Blue**: Professional blue
- **Red**: Vibrant red

### Switching Themes
```typescript
import { ThemeService } from '@app/core/services/theme.service';

constructor(private themeService: ThemeService) {}

setTheme(theme: 'light' | 'dark' | 'blue' | 'red') {
  this.themeService.setTheme(theme);
}
```

### Customizing Themes
1. Edit `src/assets/themes/_variables.scss`
2. Add colors and properties
3. Edit `src/assets/themes/_themes.scss`
4. Update `ThemeService`

## API Integration

### API Service Methods

**Services**
```typescript
// Get nearby services
apiService.searchNearbyServices(lat, lng, radius, category)

// Get filtered services
apiService.getServices(filter)

// Get service details
apiService.getServiceById(serviceId)
```

**Bookings**
```typescript
// Create booking
apiService.createBooking(bookingData)

// Get user bookings
apiService.getBookings()

// Update booking
apiService.updateBooking(bookingId, data)
```

**Chat**
```typescript
// Send message
apiService.sendMessage(messageData)

// Get chat messages
apiService.getChatMessages(bookingId)
```

### Making API Calls

```typescript
// In component or service
constructor(private apiService: ApiService) {}

loadServices() {
  this.apiService.getServices({ category: 'electrician' })
    .subscribe(
      (services) => this.handleSuccess(services),
      (error) => this.handleError(error)
    );
}
```

## Authentication

### Login
```typescript
authService.login(email, password).subscribe(
  (response) => {
    // Token stored automatically
    // Redirect to dashboard
  }
);
```

### Register
```typescript
authService.register(userData).subscribe(
  (response) => {
    // New user created
  }
);
```

### Token Handling
- Tokens stored in localStorage
- Automatically injected in requests
- Auto-refresh on expiry

## Real-time Features

### WebSocket Connection
```typescript
import { WebSocketService } from '@app/core/services/websocket.service';

constructor(private wsService: WebSocketService) {}

ngOnInit() {
  this.wsService.connect(userId);
  this.wsService.onMessageReceived().subscribe(msg => {
    // Handle message
  });
}
```

### Sending Messages
```typescript
this.wsService.sendMessage({
  bookingId: 'xxx',
  message: 'Hello!'
});
```

## Forms & Validation

### Reactive Forms Example
```typescript
import { FormBuilder, Validators } from '@angular/forms';

filterForm = this.fb.group({
  category: [[], Validators.required],
  minPrice: [0, [Validators.required, Validators.min(0)]],
  maxPrice: [10000, [Validators.required, Validators.max(100000)]]
});

applyFilters() {
  if (this.filterForm.valid) {
    // Use form data
  }
}
```

## Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run e2e

# Coverage
npm run test -- --code-coverage
```

### Writing Tests
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Building & Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build -- --configuration=production
```

### Build Output
```
dist/marketplace/
├── browser/      # Browser files
├── server/       # SSR files
└── ...
```

### Deployment Options

**Vercel**
```bash
npm run build
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod
```

**Docker**
```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist/marketplace /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Debugging

### Debug Mode
```bash
# Start with debugging enabled
ng serve --poll=2000
```

### Browser DevTools
- Angular DevTools extension
- Redux DevTools (for NgRx)
- Network tab for API calls

### Console Logging
```typescript
console.log('Variable:', variable);
console.error('Error:', error);
console.table([data1, data2]);
```

## Performance Optimization

### Code Splitting
- Lazy load feature modules
- Dynamic imports for components

### Change Detection
- OnPush strategy
- Signals for reactivity

### Bundle Analysis
```bash
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/marketplace/browser/stats.json
```

## Troubleshooting

### Common Issues

**Problem**: Services not loading
- Check API endpoint
- Verify network requests
- Check authentication token

**Problem**: Theme not applying
- Clear browser cache
- Check theme files imported
- Verify CSS variables set

**Problem**: Routing not working
- Check route configuration
- Verify component imports
- Check lazy loading setup

**Problem**: State not updating
- Check Effects dispatching actions
- Verify reducers handling actions
- Use Redux DevTools to debug

## Environment Variables

Create `.env` file (not committed):
```
NG_APP_API_URL=http://localhost:3000/api
NG_APP_SOCKET_URL=http://localhost:3000
NG_APP_GOOGLE_MAPS_KEY=your_key_here
```

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## Resources

- [Angular Docs](https://angular.io)
- [Material Docs](https://material.angular.io)
- [NgRx Docs](https://ngrx.io)
- [TypeScript Docs](https://www.typescriptlang.org)

## Support

For issues and questions:
- GitHub Issues
- Email: support@servicehub.com
- Discord: [Link]

---

**Happy coding! 🎉**
