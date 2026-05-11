import { Injectable } from '@angular/core';

import {
  Observable,
  BehaviorSubject,
  of
} from 'rxjs';

import {
  delay,
  tap
} from 'rxjs/operators';

import {
  ServiceListing
} from '../../core/models/service.model';

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;

  sortBy?:
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest';

  page?: number;
  limit?: number;
}

export interface SearchResults {
  services: ServiceListing[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  private resultsSubject =
    new BehaviorSubject<SearchResults>({
      services: [],
      total: 0,
      page: 1,
      limit: 12,
      hasMore: false
    });

  loading$ =
    this.loadingSubject.asObservable();

  results$ =
    this.resultsSubject.asObservable();

  constructor() { }

  /**
   * Search services
   */

  searchServices(
    filters: SearchFilters
  ): Observable<SearchResults> {

    this.loadingSubject.next(true);

    const limit =
      filters.limit || 12;

    const services: ServiceListing[] =
      Array.from(
        { length: limit },
        (_, i) => ({
          id: `${i + 1}`,

          name:
            filters.query
              ? `${filters.query} Service ${i + 1}`
              : `Service ${i + 1}`,

          description:
            'Professional trusted service provider.',

          category:
            'electrician' as any,

          categoryName:
            filters.category || 'Electrician',

          provider: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'provider',
            avatar:
              'https://i.pravatar.cc/150?img=3'
          } as any,

          providerId: '1',

          providerName: 'John Doe',

          price: 500 + (i * 100),

          rating: 4.5,

          reviewCount: 15 + i,

          images: [
            'https://picsum.photos/400/300'
          ],

          isActive: true,

          createdAt: new Date(),

          updatedAt: new Date(),

          distance: 2.5,

          availability: 'Available',

          responseTime: '10 mins'
        })
      );

    const results: SearchResults = {
      services,
      total: services.length,
      page: filters.page || 1,
      limit,
      hasMore: false
    };

    return of(results).pipe(

      delay(500),

      tap((res) => {

        this.resultsSubject.next(res);

        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Categories
   */

  getCategories(): Observable<any[]> {

    return of([
      {
        id: '1',
        name: 'Electrician',
        icon: 'electrical_services'
      },
      {
        id: '2',
        name: 'Plumber',
        icon: 'plumbing'
      },
      {
        id: '3',
        name: 'Tutor',
        icon: 'school'
      },
      {
        id: '4',
        name: 'Cleaner',
        icon: 'cleaning_services'
      }
    ]).pipe(
      delay(300)
    );
  }

  /**
   * Locations
   */

  getLocations(): Observable<any[]> {

    return of([
      'Kolkata',
      'Delhi',
      'Mumbai',
      'Bangalore',
      'Hyderabad',
      'Chennai'
    ]).pipe(
      delay(300)
    );
  }

  /**
   * Search suggestions
   */

  getSearchSuggestions(
    query: string
  ): Observable<string[]> {

    return of([
      `${query} repair`,
      `${query} installation`,
      `${query} service`,
      `${query} near me`
    ]).pipe(
      delay(200)
    );
  }
}