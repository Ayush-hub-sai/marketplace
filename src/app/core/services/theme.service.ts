import { Injectable, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark' | 'blue' | 'red';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<ThemeName>('light');

  private readonly themes: Record<ThemeName, any> = {
    light: {
      name: 'light',
      primary: '#1976d2',
      accent: '#ff4081',
      warn: '#f44336',
      background: '#fafafa',
      surface: '#ffffff'
    },
    dark: {
      name: 'dark',
      primary: '#64b5f6',
      accent: '#ff80ab',
      warn: '#ef5350',
      background: '#121212',
      surface: '#1e1e1e'
    },
    blue: {
      name: 'blue',
      primary: '#0288d1',
      accent: '#00b8d4',
      warn: '#ff6f00',
      background: '#e3f2fd',
      surface: '#ffffff'
    },
    red: {
      name: 'red',
      primary: '#d32f2f',
      accent: '#ff5722',
      warn: '#f57f17',
      background: '#ffebee',
      surface: '#ffffff'
    }
  };

  constructor() {
    const savedTheme = localStorage.getItem('theme') as ThemeName | null;
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: ThemeName): void {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  getTheme(name: ThemeName): any {
    return this.themes[name];
  }

  getAllThemes(): ThemeName[] {
    return Object.keys(this.themes) as ThemeName[];
  }

  private applyTheme(themeName: ThemeName): void {
    const theme = this.themes[themeName];
    const root = document.documentElement;

    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--warn-color', theme.warn);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);

    // Apply to body for Material theming
    document.body.classList.remove('light-theme', 'dark-theme', 'blue-theme', 'red-theme');
    document.body.classList.add(`${themeName}-theme`);
  }
}
