import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class.loader-container]="true" [class]="containerClass">
      <div class="loader">
        <div class="spinner"></div>
        <p class="loader-text" *ngIf="displayText">{{ displayText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 200px;
    }

    .loader-container.full-height {
      min-height: 100vh;
    }

    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--background-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loader-text {
      margin: 0;
      color: var(--text-secondary-color);
      font-size: 14px;
    }
  `]
})
export class LoaderComponent {
  @Input() text: string | null = null;
  @Input() message: string | null = null;
  @Input() containerClass: string = '';

  get displayText(): string | null {
    return this.message || this.text;
  }
}
