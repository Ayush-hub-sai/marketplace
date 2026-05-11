import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { HomeService } from '../home.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { ServiceCategory, ServiceModel } from '../../../core/models/service.model';
import { LazyLoadDirective, LazyLoadContentDirective } from '../../../shared/directives';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent,
    ServiceCardComponent,
    // LazyLoadDirective,
    LazyLoadContentDirective
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [HomeService]
})
export class HomePageComponent implements OnInit, OnDestroy {
  categories$: Observable<ServiceCategory[] | any> = new Observable();
  popularServices$: Observable<ServiceModel[] | any> = new Observable();
  recentServices$: Observable<ServiceModel[] | any> = new Observable();
  statistics$: Observable<any> = new Observable();

  // Lazy loading states
  categoriesLoaded$ = new BehaviorSubject<boolean>(false);
  popularServicesLoaded$ = new BehaviorSubject<boolean>(false);
  recentServicesLoaded$ = new BehaviorSubject<boolean>(false);

  steps = [
    {
      title: 'Search Services',
      description: 'Browse through our extensive list of services and find what you need',
      icon: 'search'
    },
    {
      title: 'Select Professional',
      description: 'Compare ratings, reviews, and prices to choose the right professional',
      icon: 'person_search'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule your service at a time that works best for you',
      icon: 'event_note'
    },
    {
      title: 'Get Service Done',
      description: 'Professional arrives and completes the service as agreed',
      icon: 'done_all'
    }
  ];

  ctaFeatures = [
    { icon: 'trending_up', text: 'Grow your business' },
    { icon: 'attach_money', text: 'Earn competitive rates' },
    { icon: 'shield', text: 'Secure platform' },
    { icon: 'people', text: 'Access to many customers' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private homeService: HomeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Load all data needed for the home page
   */
  private loadData(): void {
    this.categories$ = this.homeService.getFeaturedCategories().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return throwError(() => new Error('Failed to load categories'));
      }),
      takeUntil(this.destroy$)
    );

    this.popularServices$ = this.homeService.getPopularServices(8).pipe(
      catchError(error => {
        console.error('Error loading popular services:', error);
        return throwError(() => new Error('Failed to load services'));
      }),
      takeUntil(this.destroy$)
    );

    this.recentServices$ = this.homeService.getRecentServices(6).pipe(
      catchError(error => {
        console.error('Error loading recent services:', error);
        return throwError(() => new Error('Failed to load recent services'));
      }),
      takeUntil(this.destroy$)
    );

    this.statistics$ = this.homeService.getStatistics().pipe(
      catchError(error => {
        console.error('Error loading statistics:', error);
        return throwError(() => new Error('Failed to load statistics'));
      }),
      takeUntil(this.destroy$)
    );
  }

  /**
   * Handle service selection
   */
  onServiceSelect(serviceId: string | any): void {
    this.router.navigate(['/service', serviceId]);
  }

  /**
   * Handle search action
   */
  onSearch(event: any): void {
    const query = event.target?.value || '';
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  /**
   * Handle lazy load content visibility
   */
  onCategoriesVisible(): void {
    if (!this.categoriesLoaded$.value) {
      this.categoriesLoaded$.next(true);
    }
  }

  onPopularServicesVisible(): void {
    if (!this.popularServicesLoaded$.value) {
      this.popularServicesLoaded$.next(true);
    }
  }

  onRecentServicesVisible(): void {
    if (!this.recentServicesLoaded$.value) {
      this.recentServicesLoaded$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private locationService = inject(LocationService);

  // popularCategories = [
  //   ServiceCategory.ELECTRICIAN,
  //   ServiceCategory.PLUMBER,
  //   ServiceCategory.TUTOR,
  //   ServiceCategory.CARPENTER,
  //   ServiceCategory.PAINTER,
  //   ServiceCategory.CLEANER
  // ];

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      electrician: 'electrical_services',
      plumber: 'plumbing',
      tutor: 'school',
      carpenter: 'build',
      painter: 'palette',
      cleaner: 'cleaning_services',
      gardener: 'eco',
      mechanic: 'build_circle',
      pest_control: 'bug_report',
      ac_repair: 'ac_unit',
      locksmith: 'lock',
      mobile_repair: 'build'
    };
    return iconMap[category] || 'handyman';
  }

  getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      electrician: 'Electrical repairs & installations',
      plumber: 'Plumbing repairs & maintenance',
      tutor: 'Online & offline tutoring',
      carpenter: 'Carpentry & woodwork',
      painter: 'Painting & wall art',
      cleaner: 'Home cleaning services',
      gardener: 'Gardening & landscaping',
      mechanic: 'Vehicle repair & maintenance',
      pest_control: 'Pest control services',
      ac_repair: 'AC repair & maintenance',
      locksmith: 'Lock & key services',
      mobile_repair: 'Mobile repair services'
    };
    return descriptions[category] || 'Professional services';
  }
}


