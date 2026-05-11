import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

/**
 * Lazy Load Content Directive
 * Emits event when element comes into view (for loading content dynamically)
 * Usage: <div appLazyLoadContent (onVisible)="loadMoreContent()">
 */
@Directive({
  selector: '[appLazyLoadContent]',
  standalone: true
})
export class LazyLoadContentDirective implements OnInit, OnDestroy {
  @Output() onVisible = new EventEmitter<boolean>();

  private intersectionObserver?: IntersectionObserver;
  private hasBeenVisible = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setupObserver();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.el.nativeElement);
    }
  }

  private setupObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasBeenVisible) {
          this.hasBeenVisible = true;
          this.renderer.addClass(this.el.nativeElement, 'lazy-content-visible');
          this.onVisible.emit(true);
          this.intersectionObserver?.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.intersectionObserver.observe(this.el.nativeElement);
  }
}
