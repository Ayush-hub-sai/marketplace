import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly storageService = inject(StorageService);
  private readonly http = inject(HttpClient);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Signals for easier state management
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.initAuth();
    
    // Sync localStorage with signals
    effect(() => {
      if (this.currentUser()) {
        this.storageService.setItem('currentUser', JSON.stringify(this.currentUser() || {}));
      }
    });
  }

  private initAuth(): void {
    const storedUser = this.storageService.getItem('currentUser');
    const token = this.storageService.getItem('authToken');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser as string);
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.apiService.login(email, password).pipe(
      tap((response) => {
        if (response.token && response.user) {
          this.storageService.setItem('authToken', response.token as string);
          this.storageService.setItem('refreshToken', response.refreshToken as string);
          this.currentUser.set(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        const errorMsg = error.error?.message || 'Login failed';
        this.error.set(errorMsg);
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  register(userData: Partial<User>): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.apiService.register(userData).pipe(
      tap((response) => {
        if (response.token && response.user) {
          this.storageService.setItem('authToken', response.token as string);
          this.currentUser.set(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        const errorMsg = error.error?.message || 'Registration failed';
        this.error.set(errorMsg);
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  logout(): void {
    this.storageService.removeItem('authToken');
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('currentUser' as string);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.isAuthenticatedSubject.next(false);
    this.error.set(null);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.storageService.getItem('refreshToken') as string;
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.apiService.refreshToken().pipe(
      tap((response) => {
        if (response.token) {
          this.storageService.setItem('authToken', response.token);
        }
      }),
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  getToken(): string | null {
    return this.storageService.getItem('authToken') as string | null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
