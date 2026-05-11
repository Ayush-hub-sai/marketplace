import {
  Injectable,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

    this.isBrowser = isPlatformBrowser(
      this.platformId
    );
  }

  setItem(
    key: string,
    value: string
  ): void {

    if (!this.isBrowser) {
      return;
    }

    try {

      localStorage.setItem(
        key,
        value
      );

    } catch (error) {

      console.error(
        'Error setting item to localStorage:',
        error
      );
    }
  }

  getItem(
    key: string
  ): string | null {

    if (!this.isBrowser) {
      return null;
    }

    try {

      return localStorage.getItem(key);

    } catch (error) {

      console.error(
        'Error getting item from localStorage:',
        error
      );

      return null;
    }
  }

  removeItem(
    key: string
  ): void {

    if (!this.isBrowser) {
      return;
    }

    try {

      localStorage.removeItem(key);

    } catch (error) {

      console.error(
        'Error removing item from localStorage:',
        error
      );
    }
  }

  clear(): void {

    if (!this.isBrowser) {
      return;
    }

    try {

      localStorage.clear();

    } catch (error) {

      console.error(
        'Error clearing localStorage:',
        error
      );
    }
  }

  getAllKeys(): string[] {

    if (!this.isBrowser) {
      return [];
    }

    try {

      return Object.keys(localStorage);

    } catch (error) {

      console.error(
        'Error getting localStorage keys:',
        error
      );

      return [];
    }
  }
}