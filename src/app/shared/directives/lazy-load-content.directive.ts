import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  Renderer2,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

/**
 * Lazy Load Content Directive
 * Emits event when element comes into view
 */

@Directive({
  selector: '[appLazyLoadContent]',
  standalone: true
})
export class LazyLoadContentDirective
  implements OnInit, OnDestroy {

  @Output()
  onVisible = new EventEmitter<boolean>();

  private intersectionObserver?: IntersectionObserver;

  private hasBeenVisible = false;

  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,

    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

    this.isBrowser = isPlatformBrowser(
      this.platformId
    );
  }

  ngOnInit(): void {

    if (!this.isBrowser) {
      return;
    }

    this.setupObserver();
  }

  ngOnDestroy(): void {

    if (this.intersectionObserver) {

      this.intersectionObserver.unobserve(
        this.el.nativeElement
      );
    }
  }

  private setupObserver(): void {

    if (
      typeof IntersectionObserver === 'undefined'
    ) {

      this.makeVisible();

      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.intersectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting &&
              !this.hasBeenVisible
            ) {

              this.makeVisible();

              this.intersectionObserver?.unobserve(
                this.el.nativeElement
              );
            }
          });
        },
        options
      );

    this.intersectionObserver.observe(
      this.el.nativeElement
    );
  }

  private makeVisible(): void {

    this.hasBeenVisible = true;

    this.renderer.addClass(
      this.el.nativeElement,
      'lazy-content-visible'
    );

    this.onVisible.emit(true);
  }
}