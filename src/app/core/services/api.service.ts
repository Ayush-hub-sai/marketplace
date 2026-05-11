import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfile } from '../models/user.model';
import { Service, ServiceListing, ServiceCategory, ServiceFilter } from '../models/service.model';
import { Booking, BookingPayment, BookingChat } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api'; // Replace with your API URL

  // Auth Endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(userData: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/refresh-token`, {});
  }

  // User Endpoints
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`);
  }

  updateUserProfile(userData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/users/profile`, userData);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  // Service Endpoints
  getServices(filter?: ServiceFilter): Observable<ServiceListing[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.category?.length) {
        params = params.set('category', filter.category.join(','));
      }
      if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.minRating !== undefined) params = params.set('minRating', filter.minRating.toString());
      if (filter.maxDistance !== undefined) params = params.set('maxDistance', filter.maxDistance.toString());
      if (filter.searchQuery) params = params.set('search', filter.searchQuery);
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    }
    return this.http.get<ServiceListing[]>(`${this.apiUrl}/services`, { params });
  }

  searchNearbyServices(
    lat: number,
    lng: number,
    radius: number = 5,
    category?: ServiceCategory
  ): Observable<ServiceListing[]> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', radius.toString());

    if (category) params = params.set('category', category.toString());

    return this.http.get<ServiceListing[]>(`${this.apiUrl}/services/nearby`, { params });
  }

  getServiceById(serviceId: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/services/${serviceId}`);
  }

  createService(serviceData: Partial<Service>): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services`, serviceData);
  }

  updateService(serviceId: string, serviceData: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${serviceId}`, serviceData);
  }

  deleteService(serviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/services/${serviceId}`);
  }

  getServicesByProvider(providerId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/providers/${providerId}/services`);
  }

  // Booking Endpoints
  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  updateBooking(bookingId: string, bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${bookingId}`, bookingData);
  }

  cancelBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  // Payment Endpoints
  processPayment(bookingId: string, paymentData: Partial<BookingPayment>): Observable<BookingPayment> {
    return this.http.post<BookingPayment>(`${this.apiUrl}/payments`, { bookingId, ...paymentData });
  }

  getPaymentStatus(paymentId: string): Observable<BookingPayment> {
    return this.http.get<BookingPayment>(`${this.apiUrl}/payments/${paymentId}`);
  }

  // Chat Endpoints
  sendMessage(message: Partial<BookingChat>): Observable<BookingChat> {
    return this.http.post<BookingChat>(`${this.apiUrl}/messages`, message);
  }

  getChatMessages(bookingId: string): Observable<BookingChat[]> {
    return this.http.get<BookingChat[]>(`${this.apiUrl}/messages/${bookingId}`);
  }

  // Review Endpoints
  submitReview(serviceId: string, reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews`, { serviceId, ...reviewData });
  }

  getServiceReviews(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services/${serviceId}/reviews`);
  }
}
