import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

export type ThemeName = 'light' | 'dark' | 'blue' | 'red';

interface ThemeConfig {
  name: ThemeName;
  primary: string;
  primaryRgb: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentRgb: string;
  warn: string;
  warnRgb: string;
  success: string;
  successRgb: string;
  info: string;
  infoRgb: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  currentTheme = signal<ThemeName>('light');

  private isBrowser: boolean;

  private readonly themes: Record<ThemeName, ThemeConfig> = {
    light: {
      name: 'light',
      primary: '#1976d2',
      primaryRgb: '25, 118, 210',
      primaryDark: '#1565c0',
      primaryLight: '#e3f2fd',
      accent: '#ff4081',
      accentRgb: '255, 64, 129',
      warn: '#f44336',
      warnRgb: '244, 67, 54',
      success: '#4caf50',
      successRgb: '76, 175, 80',
      info: '#2196f3',
      infoRgb: '33, 150, 243',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575'
    },

    dark: {
      name: 'dark',
      primary: '#64b5f6',
      primaryRgb: '100, 181, 246',
      primaryDark: '#42a5f5',
      primaryLight: '#1a237e',
      accent: '#ff80ab',
      accentRgb: '255, 128, 171',
      warn: '#ef5350',
      warnRgb: '239, 83, 80',
      success: '#66bb6a',
      successRgb: '102, 187, 106',
      info: '#42a5f5',
      infoRgb: '66, 165, 245',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0'
    },

    blue: {
      name: 'blue',
      primary: '#0288d1',
      primaryRgb: '2, 136, 209',
      primaryDark: '#01579b',
      primaryLight: '#e1f5fe',
      accent: '#00b8d4',
      accentRgb: '0, 184, 212',
      warn: '#ff6f00',
      warnRgb: '255, 111, 0',
      success: '#4caf50',
      successRgb: '76, 175, 80',
      info: '#0288d1',
      infoRgb: '2, 136, 209',
      background: '#e1f5fe',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575'
    },

    red: {
      name: 'red',
      primary: '#d32f2f',
      primaryRgb: '211, 47, 47',
      primaryDark: '#b71c1c',
      primaryLight: '#ffebee',
      accent: '#ff5722',
      accentRgb: '255, 87, 34',
      warn: '#f57f17',
      warnRgb: '245, 127, 23',
      success: '#4caf50',
      successRgb: '76, 175, 80',
      info: '#d32f2f',
      infoRgb: '211, 47, 47',
      background: '#ffebee',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575'
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {

      const savedTheme = localStorage.getItem('theme') as ThemeName | null;

      if (savedTheme && this.themes[savedTheme]) {
        this.setTheme(savedTheme);
      } else {
        this.setTheme('light');
      }

    }
  }

  setTheme(theme: ThemeName): void {

    this.currentTheme.set(theme);

    if (this.isBrowser) {
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
    }
  }

  getTheme(name: ThemeName): ThemeConfig {
    return this.themes[name];
  }

  getAllThemes(): ThemeName[] {
    return Object.keys(this.themes) as ThemeName[];
  }

  private applyTheme(themeName: ThemeName): void {

    if (!this.isBrowser) return;

    const theme = this.themes[themeName];
    const root = document.documentElement;

    // Apply all CSS custom properties
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--primary-color-rgb', theme.primaryRgb);
    root.style.setProperty('--primary-dark', theme.primaryDark);
    root.style.setProperty('--primary-light', theme.primaryLight);
    
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--accent-color-rgb', theme.accentRgb);
    
    root.style.setProperty('--warn-color', theme.warn);
    root.style.setProperty('--warn-color-rgb', theme.warnRgb);
    
    root.style.setProperty('--success-color', theme.success);
    root.style.setProperty('--success-color-rgb', theme.successRgb);
    
    root.style.setProperty('--info-color', theme.info);
    root.style.setProperty('--info-color-rgb', theme.infoRgb);
    
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--text-secondary-color', theme.textSecondary);

    // Apply theme class to body for CSS selectors
    document.body.classList.remove(
      'light-theme',
      'dark-theme',
      'blue-theme',
      'red-theme'
    );

    document.body.classList.add(`${themeName}-theme`);
    
    // Also add to html element
    document.documentElement.classList.remove(
      'light-theme',
      'dark-theme',
      'blue-theme',
      'red-theme'
    );

    document.documentElement.classList.add(`${themeName}-theme`);
  }
}