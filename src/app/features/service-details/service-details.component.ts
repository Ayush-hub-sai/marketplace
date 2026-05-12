import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, takeUntil, catchError, finalize, filter } from 'rxjs/operators';
import { ServiceModel } from '../../core/models/service.model';
import { ServiceDetailsService } from './service-details.service';
import { BookingService } from '../booking/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { LazyLoadDirective, LazyLoadContentDirective } from '../../shared/directives';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
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

  private serviceDetailsService = inject(ServiceDetailsService);
  private bookingService        = inject(BookingService);
  private authService           = inject(AuthService);
  private route                 = inject(ActivatedRoute);
  private router                = inject(Router);
  private formBuilder           = inject(FormBuilder);
  private snackBar              = inject(MatSnackBar);

  // ✅ No null — filtered in stream
  service$!:         Observable<ServiceModel>;
  reviews$!:         Observable<any[]>;
  relatedServices$!: Observable<ServiceModel[]>;
  loading$:          Observable<boolean> = this.serviceDetailsService.loading$;

  bookingLoading$         = new BehaviorSubject<boolean>(false);
  relatedServicesLoaded$  = new BehaviorSubject<boolean>(false);

  bookingForm: FormGroup = this.createBookingForm();
  isSaved = false;

  availableTimeSlots: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeComponent();
  }

  private createBookingForm(): FormGroup {
    return this.formBuilder.group({
      bookingDate: ['', Validators.required],
      bookingTime: ['', Validators.required],
      notes:       ['']
    });
  }

  private initializeComponent(): void {
    this.service$ = this.route.params.pipe(
      switchMap(params =>
        this.serviceDetailsService.getServiceById(params['id']).pipe(
          catchError(error => {
            console.error('Error loading service:', error);
            this.snackBar.open('Failed to load service details', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            return throwError(() => new Error('Failed to load service'));
          })
        )
      ),
      // ✅ Type guard — removes null/undefined from stream type
      filter((service): service is ServiceModel => service != null),
      takeUntil(this.destroy$)
    );

    this.service$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(service => {
      this.relatedServices$ = this.serviceDetailsService
        .getRelatedServices(service.id)
        .pipe(takeUntil(this.destroy$));

      this.reviews$ = this.serviceDetailsService
        .getProviderReviews(service.providerId)
        .pipe(takeUntil(this.destroy$));
    });
  }

  selectImage(index: number): void {
    console.log('Selected image:', index);
  }

  onBook(): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please login to book a service', 'Login', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }).onAction().pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
      return;
    }

    if (this.bookingForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.service$.pipe(
      switchMap(service => {
        const bookingData = {
          serviceId:    service.id,
          serviceName:  service.name,
          providerId:   service.providerId,
          providerName: service.providerName,
          bookingDate:  this.bookingForm.get('bookingDate')?.value,
          bookingTime:  this.bookingForm.get('bookingTime')?.value,
          notes:        this.bookingForm.get('notes')?.value,
          price:        service.price,
          tax:          service.tax || 0,
          totalPrice:   (service.price || 0) + (service.tax || 0)
        };

        this.bookingLoading$.next(true);
        return this.bookingService.createBooking(bookingData).pipe(
          finalize(() => this.bookingLoading$.next(false))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.snackBar.open('✓ Booking created successfully!', 'View', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }).onAction().pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.router.navigate(['/bookings']);
        });
        this.bookingForm.reset();
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to create booking. Please try again.',
          'Close',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  onSave(): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please login to save services', 'Login', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }).onAction().pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
      return;
    }

    this.isSaved = !this.isSaved;
    this.snackBar.open(
      this.isSaved ? '❤ Service saved!' : '♡ Service removed from saved',
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: this.isSaved ? ['success-snackbar'] : []
      }
    );
  }

  onServiceSelect(serviceId: string): void {
    if (serviceId) {
      this.router.navigate(['/service-details', serviceId]);
    }
  }

  onRelatedServicesVisible(): void {
    if (!this.relatedServicesLoaded$.value) {
      this.relatedServicesLoaded$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.bookingLoading$.complete();
    this.relatedServicesLoaded$.complete();
  }
}