import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  ServiceCategory,
  ServiceListing
} from '../../core/models/service.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor() { }

  /**
   * Get featured categories
   */
  getFeaturedCategories(): Observable<ServiceCategory[]> {

    this.loadingSubject.next(true);

    const categories: ServiceCategory[] = [
      {
        id: '1',
        name: 'Electrician',
        icon: 'electrical_services',
        serviceCount: 24
      },
      {
        id: '2',
        name: 'Plumber',
        icon: 'plumbing',
        serviceCount: 18
      },
      {
        id: '3',
        name: 'Tutor',
        icon: 'school',
        serviceCount: 30
      },
      {
        id: '4',
        name: 'Cleaner',
        icon: 'cleaning_services',
        serviceCount: 15
      },
      {
        id: '5',
        name: 'Painter',
        icon: 'palette',
        serviceCount: 11
      },
      {
        id: '6',
        name: 'Gardener',
        icon: 'eco',
        serviceCount: 8
      }
    ];

    return of(categories).pipe(
      delay(500)
    );
  }

  /**
   * Get popular services
   */
  getPopularServices(limit: number = 8): Observable<ServiceListing[]> {

    const services: ServiceListing[] = Array.from(
      { length: limit },
      (_, i) => ({
        id: `${i + 1}`,

        name: `Popular Service ${i + 1}`,

        description:
          'Professional and reliable home service provider.',

        category: 'electrician' as any,

        categoryName: 'Electrician',

        provider: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'provider',
          avatar: 'https://i.pravatar.cc/150?img=3'
        } as any,

        providerId: '1',

        providerName: 'John Doe',

        price: 499 + (i * 100),

        rating: 4.5,

        reviewCount: 20 + i,

        images: [
          'https://picsum.photos/400/300'
        ],

        isActive: true,

        createdAt: new Date(),

        updatedAt: new Date(),

        distance: 2.5
      })
    );

    return of(services).pipe(
      delay(500)
    );
  }

  /**
   * Get recent services
   */
  getRecentServices(limit: number = 6): Observable<ServiceListing[]> {

    const services: ServiceListing[] = Array.from(
      { length: limit },
      (_, i) => ({
        id: `${i + 100}`,

        name: `Recent Service ${i + 1}`,

        description:
          'Recently added trusted professional service.',

        category: 'plumber' as any,

        categoryName: 'Plumber',

        provider: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'provider',
          avatar: 'https://i.pravatar.cc/150?img=3'
        } as any,

        providerId: '2',

        providerName: 'Jane Smith',

        price: 699 + (i * 50),

        rating: 4.8,

        reviewCount: 10 + i,

        images: [
          'https://picsum.photos/400/300'
        ],

        isActive: true,

        createdAt: new Date(),

        updatedAt: new Date(),

        distance: 1.8
      })
    );

    return of(services).pipe(
      delay(500)
    );
  }

  /**
   * Get statistics
   */
  getStatistics(): Observable<any[]> {

    const stats = [
      {
        icon: 'people',
        value: '10K+',
        label: 'Customers'
      },
      {
        icon: 'build',
        value: '500+',
        label: 'Professionals'
      },
      {
        icon: 'verified',
        value: '100%',
        label: 'Verified Services'
      },
      {
        icon: 'star',
        value: '4.9',
        label: 'Average Rating'
      }
    ];

    return of(stats).pipe(
      delay(300)
    );
  }
}