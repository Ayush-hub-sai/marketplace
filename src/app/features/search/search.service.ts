import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ServiceModel } from '../../core/models/service.model';

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResults {
  services: ServiceModel[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly apiUrl = '/api/services';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private resultsSubject = new BehaviorSubject<SearchResults>({
    services: [],
    total: 0,
    page: 1,
    limit: 12,
    hasMore: false
  });

  loading$ = this.loadingSubject.asObservable();
  results$ = this.resultsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Search services with filters
   */
  searchServices(filters: SearchFilters): Observable<SearchResults> {
    this.loadingSubject.next(true);

    let params = new HttpParams();

    if (filters.query) params = params.set('q', filters.query);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.rating) params = params.set('rating', filters.rating.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<SearchResults>(`${this.apiUrl}/search`, { params }).pipe(
      tap(results => {
        this.resultsSubject.next(results);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Get categories for filter dropdown
   */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Get locations for filter dropdown
   */
  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(`/api/locations`);
  }

  /**
   * Get search suggestions based on query
   */
  getSearchSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: new HttpParams().set('q', query)
    });
  }
}
