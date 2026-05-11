import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { SearchService, SearchFilters, SearchResults } from '../search.service';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { LazyLoadDirective, LazyLoadContentDirective } from '../../../shared/directives';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ServiceCardComponent,
    LoaderComponent,
    // LazyLoadDirective,
    LazyLoadContentDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  providers: [SearchService]
})
export class SearchPageComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  searchQuery: string = '';

  categories$: Observable<any[]>;
  locations$: Observable<any[]>;
  results$: Observable<SearchResults>;
  loading$: Observable<boolean>;

  // Lazy loading states
  resultsLoaded$ = new BehaviorSubject<boolean>(false);

  private currentFilters: SearchFilters = { page: 1, limit: 12 };
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filterForm = this.createFilterForm();
    this.categories$ = this.searchService.getCategories();
    this.locations$ = this.searchService.getLocations();
    this.results$ = this.searchService.results$;
    this.loading$ = this.searchService.loading$;
  }

  ngOnInit(): void {
    // Get search params from URL
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.currentFilters.query = params['q'];
      }
      if (params['category']) {
        this.filterForm.get('category')?.setValue(params['category']);
        this.currentFilters.category = params['category'];
      }
      this.performSearch();
    });
  }

  /**
   * Create filter form
   */
  private createFilterForm(): FormGroup {
    return this.formBuilder.group({
      category: [''],
      location: [''],
      minPrice: [0],
      maxPrice: [10000],
      rating: [0],
      sortBy: ['relevance']
    });
  }

  /**
   * Handle search submission
   */
  onSearch(): void {
    this.currentFilters.query = this.searchQuery;
    this.currentFilters.page = 1;
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  /**
   * Apply filters
   */
  onApplyFilters(): void {
    const formValue = this.filterForm.value;
    this.currentFilters = {
      ...this.currentFilters,
      category: formValue.category || undefined,
      location: formValue.location || undefined,
      minPrice: formValue.minPrice || undefined,
      maxPrice: formValue.maxPrice || undefined,
      rating: formValue.rating || undefined,
      sortBy: formValue.sortBy || 'relevance',
      page: 1
    };
    this.performSearch();
  }

  /**
   * Reset all filters
   */
  onResetFilters(): void {
    this.filterForm.reset({
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      sortBy: 'relevance'
    });
    this.searchQuery = '';
    this.currentFilters = { page: 1, limit: 12 };
    this.router.navigate(['/search']);
  }

  /**
   * Select rating filter
   */
  selectRating(rating: number): void {
    this.filterForm.get('rating')?.setValue(rating);
  }

  /**
   * Perform the search with current filters
   */
  private performSearch(): void {
    this.searchService.searchServices(this.currentFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        error => console.error('Search error:', error)
      );
  }

  /**
   * Navigate to next page
   */
  onNextPage(): void {
    this.currentFilters.page = (this.currentFilters.page || 1) + 1;
    this.performSearch();
  }

  /**
   * Navigate to previous page
   */
  onPreviousPage(): void {
    if ((this.currentFilters.page || 1) > 1) {
      this.currentFilters.page = (this.currentFilters.page || 1) - 1;
      this.performSearch();
    }
  }

  /**
   * Select a service
   */
  onSelectService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  /**
   * Calculate total pages
   */
  getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Handle lazy load results visibility
   */
  onResultsVisible(): void {
    if (!this.resultsLoaded$.value) {
      this.resultsLoaded$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
