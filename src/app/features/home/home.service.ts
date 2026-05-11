import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ServiceCategory, ServiceModel } from '../../core/models/service.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly apiUrl = '/api';
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get featured categories
   */
  getFeaturedCategories(): Observable<ServiceCategory[]> {
    this.loadingSubject.next(true);
    return this.http.get<ServiceCategory[]>(`${this.apiUrl}/categories/featured`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Get popular services
   */
  getPopularServices(limit: number = 8): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(
      `${this.apiUrl}/services/popular?limit=${limit}`
    );
  }

  /**
   * Get recent services
   */
  getRecentServices(limit: number = 6): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(
      `${this.apiUrl}/services/recent?limit=${limit}`
    );
  }

  /**
   * Get statistics for dashboard
   */
  getStatistics(): Observable<{ totalServices: number; totalUsers: number; totalBookings: number }> {
    return this.http.get<{ totalServices: number; totalUsers: number; totalBookings: number }>(
      `${this.apiUrl}/statistics`
    );
  }
}
