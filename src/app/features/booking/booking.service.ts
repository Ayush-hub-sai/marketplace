import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  userId: string;
  bookingDate: Date;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = '/api/bookings';
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  bookings$ = this.bookingsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Create a new booking
   */
  createBooking(booking: Partial<Booking>): Observable<Booking> {
    this.loadingSubject.next(true);
    return this.http.post<Booking>(this.apiUrl, booking).pipe(
      tap(newBooking => {
        const bookings = this.bookingsSubject.value;
        this.bookingsSubject.next([...bookings, newBooking]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Get all bookings for current user
   */
  getUserBookings(): Observable<Booking[]> {
    this.loadingSubject.next(true);
    return this.http.get<Booking[]>(`${this.apiUrl}/user`).pipe(
      tap(bookings => {
        this.bookingsSubject.next(bookings);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: string, status: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: string, reason?: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/${id}/cancel`, { reason });
  }
}
