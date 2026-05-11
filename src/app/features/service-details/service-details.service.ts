import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ServiceModel } from '../../core/models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailsService {
  private readonly apiUrl = '/api/services';
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get service details by ID
   */
  getServiceById(serviceId: string): Observable<ServiceModel> {
    this.loadingSubject.next(true);
    return this.http.get<ServiceModel>(`${this.apiUrl}/${serviceId}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Get related services
   */
  getRelatedServices(serviceId: string, limit: number = 4): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(
      `${this.apiUrl}/${serviceId}/related?limit=${limit}`
    );
  }

  /**
   * Get provider reviews and ratings
   */
  getProviderReviews(providerId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/providers/${providerId}/reviews`);
  }
}
