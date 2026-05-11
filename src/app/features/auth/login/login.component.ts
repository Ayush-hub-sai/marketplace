import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="logo">login</mat-icon>
            Login to ServiceHub
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Enter your email"
              />
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Invalid email format
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter your password"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="togglePasswordVisibility()"
                type="button"
              >
                <mat-icon>
                  {{ showPassword() ? 'visibility' : 'visibility_off' }}
                </mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="authService.error()">
              {{ authService.error() }}
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!loginForm.valid || authService.isLoading()"
              class="full-width"
            >
              <mat-spinner *ngIf="authService.isLoading()" diameter="20"></mat-spinner>
              {{ authService.isLoading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Register here</a></p>
            <p><a href="#forgot-password">Forgot password?</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--surface-color);
    }

    mat-card-header {
      margin-bottom: 24px;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 24px;

        .logo {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--primary-color);
        }
      }
    }

    mat-card-content {
      padding: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      &.full-width {
        width: 100%;
      }
    }

    button[type="submit"] {
      text-transform: none;
      font-size: 16px;
      padding: 12px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      mat-spinner {
        margin-right: 8px;
      }
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;

      p {
        margin: 8px 0;
        font-size: 14px;
        color: var(--text-secondary-color);

        a {
          color: var(--primary-color);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        box-shadow: none;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(AuthService);

  loginForm!: FormGroup;
  showPassword = signal(false);

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/user-dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
}
