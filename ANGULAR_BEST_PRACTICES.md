# Angular Best Practices & Configuration

## Component Structure

### Anatomy of a Production-Ready Component
```typescript
// component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feature',
  standalone: true, // Use standalone for better tree-shaking
  imports: [CommonModule, MatButtonModule],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  providers: [FeatureService] // Local providers
})
export class FeatureComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Output() event = new EventEmitter<any>();

  items$: Observable<Item[]>;
  loading$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(private service: FeatureService) {}

  ngOnInit(): void {
    this.items$ = this.service.getItems().pipe(
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Services

### API Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
```

## Change Detection

### Use OnPush Strategy
```typescript
@Component({
  selector: 'app-expensive-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ExpensiveComponent {}
```

## State Management (NgRx)

### Actions
```typescript
export const loadItems = createAction(
  '[Items Page] Load Items',
  props<{ filter: ItemFilter }>()
);

export const loadItemsSuccess = createAction(
  '[Items API] Load Items Success',
  props<{ items: Item[] }>()
);

export const loadItemsFailure = createAction(
  '[Items API] Load Items Failure',
  props<{ error: string }>()
);
```

### Reducers
```typescript
export const itemsReducer = createReducer(
  initialState,
  on(loadItems, (state) => ({ ...state, loading: true })),
  on(loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),
  on(loadItemsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
```

### Effects
```typescript
@Injectable()
export class ItemsEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      switchMap(({ filter }) =>
        this.itemsService.getItems(filter).pipe(
          map(items => loadItemsSuccess({ items })),
          catchError(error => of(loadItemsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private itemsService: ItemsService
  ) {}
}
```

## RxJS Patterns

### Unsubscribe Pattern
```typescript
// GOOD
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Async Pipe in Template
```html
<!-- BETTER - Automatic unsubscribe -->
<div>{{ items$ | async }}</div>
```

## HTTP Interceptors

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.auth.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
```

## Guards

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      map(isAuth => {
        if (isAuth) return true;
        this.router.navigate(['/auth/login']);
        return false;
      })
    );
  }
}
```

## Performance Tips

### 1. Code Splitting
```typescript
const routes: Routes = [
  {
    path: 'feature',
    loadComponent: () => import('./feature/feature.component')
      .then(m => m.FeatureComponent)
  }
];
```

### 2. Lazy Loading Images
```html
<img [src]="imagePath" loading="lazy" alt="description" />
```

### 3. Virtual Scrolling
```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

<cdk-virtual-scroll-viewport itemSize="50" class="list">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

### 4. TrackBy Function
```typescript
trackByFn(index: number, item: Item): any {
  return item.id;
}
```

```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

## Testing

### Unit Test Example
```typescript
describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let service: ItemService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemComponent],
      providers: [
        { provide: ItemService, useValue: jasmine.createSpyObj('ItemService', ['getItems']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ItemService);
  });

  it('should display items', () => {
    const items = [{ id: 1, name: 'Item 1' }];
    (service.getItems as jasmine.Spy).and.returnValue(of(items));

    fixture.detectChanges();

    expect(component.items).toEqual(items);
  });
});
```

## Styling Best Practices

### SCSS Structure
```scss
// Component SCSS
@use '../../../assets/themes/variables' as *;

.component {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $background-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  transition: all $transition-base;

  &:hover {
    box-shadow: $shadow-lg;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: $spacing-md;
  }
}
```

### Utility Classes
```scss
// Instead of repeated styles
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.m-2 { margin: $spacing-md; }
.p-2 { padding: $spacing-md; }
```

## Dependency Injection

### Singleton Services
```typescript
@Injectable({ providedIn: 'root' }) // Singleton
export class AuthService {}
```

### Local Services
```typescript
@Component({
  providers: [LocalService] // New instance per component
})
```

## Error Handling

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        this.notification.error('Error', error.message);
        return throwError(() => error);
      })
    );
  }
}
```

## Accessibility

```html
<!-- Semantic HTML -->
<button aria-label="Close menu" (click)="closeMenu()">
  <mat-icon>close</mat-icon>
</button>

<!-- Form accessibility -->
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput type="email" aria-label="Email address" />
</mat-form-field>
```

---

For more information, visit: https://angular.io/docs
