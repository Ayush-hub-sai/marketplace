import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService, ThemeName } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <mat-icon class="logo-icon">home_repair_service</mat-icon>
            <span>ServiceHub</span>
          </a>
        </div>

        <div class="navbar-search">
          <input
            type="text"
            placeholder="Search services..."
            class="search-input"
            (keyup.enter)="onSearch()"
          />
          <mat-icon class="search-icon">search</mat-icon>
        </div>

        <div class="navbar-menu">
          <button mat-button routerLink="/search">
            <mat-icon>explore</mat-icon>
            <span>Explore</span>
          </button>

          <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/auth/login">
            <mat-icon>login</mat-icon>
            <span>Login</span>
          </button>

          <button
            mat-button
            *ngIf="authService.isAuthenticated()"
            [matMenuTriggerFor]="userMenu"
          >
            <mat-icon>account_circle</mat-icon>
            <span>{{ authService.currentUser()?.name || 'Profile' }}</span>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="themeMenu" class="theme-btn">
            <mat-icon>palette</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <mat-menu #userMenu="matMenu">
      <button mat-menu-item routerLink="/user-dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </button>
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item routerLink="/bookings">
        <mat-icon>calendar_today</mat-icon>
        <span>Bookings</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>

    <mat-menu #themeMenu="matMenu">
      <button
        mat-menu-item
        *ngFor="let theme of themeService.getAllThemes()"
        (click)="themeService.setTheme(theme)"
        [attr.aria-label]="'Set ' + theme + ' theme'"
      >
        <mat-icon
          [color]="themeService.currentTheme() === theme ? 'primary' : ''"
        >
          {{ theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'palette' }}
        </mat-icon>
        <span>{{ theme | titlecase }} Theme</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 16px;
      width: 100%;
      gap: 24px;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      font-weight: 600;
      font-size: 20px;
    }

    .logo-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .navbar-search {
      flex: 1;
      display: flex;
      align-items: center;
      background: var(--background-color);
      border-radius: 24px;
      padding: 8px 16px;
      max-width: 400px;
      gap: 8px;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: var(--text-color);

      &::placeholder {
        color: var(--text-secondary-color);
      }
    }

    .search-icon {
      color: var(--text-secondary-color);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    button {
      text-transform: none;
      font-size: 14px;
    }

    .theme-btn {
      margin-left: 8px;
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-wrap: wrap;
        gap: 8px;
      }

      .navbar-search {
        order: 3;
        width: 100%;
        flex-basis: 100%;
        max-width: 100%;
      }

      .navbar-menu {
        gap: 4px;
      }

      button span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  ngOnInit(): void {
    // Component initialization if needed
  }

  onSearch(): void {
    // Implement search functionality
  }

  logout(): void {
    this.authService.logout();
  }
}
