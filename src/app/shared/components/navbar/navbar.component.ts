import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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

  changeTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  getThemeIcon(): string {
    const currentTheme = this.themeService.currentTheme();
    if (currentTheme === 'light') return 'light_mode';
    if (currentTheme === 'dark') return 'dark_mode';
    return 'palette';
  }

  getThemeIconForMenu(theme: ThemeName): string {
    if (theme === 'light') return 'light_mode';
    if (theme === 'dark') return 'dark_mode';
    return 'palette';
  }
}
