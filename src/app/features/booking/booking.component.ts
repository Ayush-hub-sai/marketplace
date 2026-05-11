import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { BookingService, Booking } from './booking.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { LazyLoadDirective, LazyLoadContentDirective } from '../../shared/directives';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    LoaderComponent,
    // LazyLoadDirective,
    // LazyLoadContentDirective
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers: [BookingService]
})
export class BookingComponent implements OnInit, OnDestroy {
  bookings$: Observable<Booking[]>;
  filteredBookings$: Observable<Booking[]>;
  loading$: Observable<boolean>;

  filterStatuses = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
  selectedStatus: string = 'all';

  private filteredBookingsSubject = new BehaviorSubject<Booking[]>([]);
  private destroy$ = new Subject<void>();

  constructor(private bookingService: BookingService) {
    this.bookings$ = this.bookingService.bookings$;
    this.loading$ = this.bookingService.loading$;
    this.filteredBookings$ = this.filteredBookingsSubject.asObservable();
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  /**
   * Load user bookings
   */
  private loadBookings(): void {
    this.bookingService.getUserBookings()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(bookings => {
        this.applyFilter(bookings);
      });
  }

  /**
   * Handle filter change
   */
  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.bookings$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(bookings => {
      this.applyFilter(bookings);
    });
  }

  /**
   * Apply filter to bookings
   */
  private applyFilter(bookings: Booking[]): void {
    if (this.selectedStatus === 'all') {
      this.filteredBookingsSubject.next(bookings);
    } else {
      const filtered = bookings.filter(b => b.status === this.selectedStatus);
      this.filteredBookingsSubject.next(filtered);
    }
  }

  /**
   * Get count for status
   */
  getStatusCount(status: string): number {
    let count = 0;
    this.bookings$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(bookings => {
      if (status === 'all') {
        count = bookings.length;
      } else {
        count = bookings.filter(b => b.status === status).length;
      }
    });
    return count;
  }

  /**
   * Cancel booking
   */
  onCancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.loadBookings();
          },
          error => console.error('Error cancelling booking:', error)
        );
    }
  }

  /**
   * View booking details
   */
  onViewDetails(booking: Booking): void {
    console.log('View details for booking:', booking.id);
    // TODO: Navigate to booking details page
  }

  /**
   * Leave review for completed service
   */
  onLeaveReview(booking: Booking): void {
    console.log('Leave review for booking:', booking.id);
    // TODO: Open review modal
  }

  /**
   * Rebook same service
   */
  onRebookService(booking: Booking): void {
    console.log('Rebook service:', booking.serviceId);
    // TODO: Navigate to service details with rebook flag
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
