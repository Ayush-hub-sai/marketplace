import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { ServiceModel } from '../../core/models/service.model';
import { ServiceDetailsService } from './service-details.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { LazyLoadDirective, LazyLoadContentDirective } from '../../shared/directives';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    LoaderComponent,
    ServiceCardComponent,
    LazyLoadDirective,
    LazyLoadContentDirective
  ],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  providers: [ServiceDetailsService]
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  service$: Observable<ServiceModel | null> = new Observable();
  reviews$: Observable<any[]> = new Observable();
  relatedServices$: Observable<ServiceModel[]> = new Observable();
  loading$: Observable<boolean>;

  // Lazy loading states
  relatedServicesLoaded$ = new BehaviorSubject<boolean>(false);

  availableTimeSlots: string[] = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private serviceDetailsService: ServiceDetailsService,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.serviceDetailsService.loading$;
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Initialize component with route params and load data
   */
  private initializeComponent(): void {
    this.service$ = this.route.params.pipe(
      switchMap(params => {
        const serviceId = params['id'];
        return this.serviceDetailsService.getServiceById(serviceId).pipe(
          catchError(error => {
            console.error('Error loading service:', error);
            return throwError(() => new Error('Failed to load service'));
          })
        );
      }),
      takeUntil(this.destroy$)
    );

    // Load related services and reviews
    this.service$.pipe(
      switchMap(service => {
        if (!service) {
          return new Observable(observer => observer.next(null));
        }

        // Load related services
        this.relatedServices$ = this.serviceDetailsService
          .getRelatedServices(service.id)
          .pipe(takeUntil(this.destroy$));

        // Load reviews
        this.reviews$ = this.serviceDetailsService
          .getProviderReviews(service.providerId)
          .pipe(takeUntil(this.destroy$));

        return this.service$;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Handle booking action
   */
  onBook(): void {
    console.log('Book service');
    // TODO: Implement booking logic
  }

  /**
   * Handle save for later action
   */
  onSave(): void {
    console.log('Save service for later');
    // TODO: Implement save logic
  }

  /**
   * Navigate to another service
   */
  onServiceSelect(serviceId: string): void {
    // Navigate to service details with new ID
    this.route.params.pipe(
      switchMap(() => this.route.params),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Handle lazy load related services visibility
   */
  onRelatedServicesVisible(): void {
    if (!this.relatedServicesLoaded$.value) {
      this.relatedServicesLoaded$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
