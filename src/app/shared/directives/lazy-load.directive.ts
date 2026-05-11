import {
  Directive,
  ElementRef,
  Input,
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
 * LazyLoad Directive
 * Lazy loads images using Intersection Observer API
 */

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective
  implements OnInit, OnDestroy {

  @Input()
  appLazyLoadSrc: string = '';

  @Input()
  appLazyLoadPlaceholder: string =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23E5E7EB" width="400" height="300"/%3E%3C/svg%3E';

  @Input()
  appLazyLoadErrorImage: string =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F3F4F6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" fill="%236B7280" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E';

  private intersectionObserver?: IntersectionObserver;

  private isBrowser: boolean;

  constructor(
    private el: ElementRef<HTMLImageElement>,
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

    this.setupLazyLoad();
  }

  ngOnDestroy(): void {

    if (this.intersectionObserver) {

      this.intersectionObserver.unobserve(
        this.el.nativeElement
      );
    }
  }

  private setupLazyLoad(): void {

    if (!this.appLazyLoadSrc) {
      return;
    }

    this.renderer.setAttribute(
      this.el.nativeElement,
      'src',
      this.appLazyLoadPlaceholder
    );

    this.renderer.addClass(
      this.el.nativeElement,
      'lazy-loading'
    );

    if (
      typeof IntersectionObserver === 'undefined'
    ) {

      this.loadImage();

      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    this.intersectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              this.loadImage();

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

  private loadImage(): void {

    if (!this.isBrowser) {
      return;
    }

    const img = new Image();

    img.onload = () => {

      this.renderer.setAttribute(
        this.el.nativeElement,
        'src',
        this.appLazyLoadSrc
      );

      this.renderer.removeClass(
        this.el.nativeElement,
        'lazy-loading'
      );

      this.renderer.addClass(
        this.el.nativeElement,
        'lazy-loaded'
      );
    };

    img.onerror = () => {

      this.renderer.setAttribute(
        this.el.nativeElement,
        'src',
        this.appLazyLoadErrorImage
      );

      this.renderer.removeClass(
        this.el.nativeElement,
        'lazy-loading'
      );

      this.renderer.addClass(
        this.el.nativeElement,
        'lazy-error'
      );
    };

    img.src = this.appLazyLoadSrc;
  }
}