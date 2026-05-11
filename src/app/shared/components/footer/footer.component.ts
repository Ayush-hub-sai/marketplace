import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4>About ServiceHub</h4>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/careers">Careers</a></li>
            <li><a routerLink="/blog">Blog</a></li>
            <li><a routerLink="/press">Press</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a routerLink="/search?category=electrician">Electrician</a></li>
            <li><a routerLink="/search?category=plumber">Plumber</a></li>
            <li><a routerLink="/search?category=tutor">Tutor</a></li>
            <li><a routerLink="/search?category=carpenter">Carpenter</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a routerLink="/help">Help Center</a></li>
            <li><a routerLink="/contact">Contact Us</a></li>
            <li><a routerLink="/faq">FAQ</a></li>
            <li><a routerLink="/safety">Safety Tips</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener">
              <mat-icon>facebook</mat-icon>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener">
              <mat-icon>twitter</mat-icon>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener">
              <mat-icon>instagram</mat-icon>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener">
              <mat-icon>language</mat-icon>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 ServiceHub. All rights reserved.</p>
          <div class="footer-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="divider">•</span>
            <a routerLink="/terms">Terms of Service</a>
            <span class="divider">•</span>
            <a routerLink="/cookie">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--surface-color);
      color: var(--text-color);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 60px;
    }

    .footer-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 16px;
    }

    .footer-section {
      h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        margin-bottom: 12px;
      }

      a {
        color: var(--text-secondary-color);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .social-links {
      display: flex;
      gap: 16px;

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--background-color);
        transition: background-color 0.3s ease, color 0.3s ease;

        &:hover {
          background: var(--primary-color);
          color: white;

          mat-icon {
            color: white;
          }
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .footer-bottom {
      background: var(--background-color);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 24px 16px;
    }

    .footer-bottom-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      p {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary-color);
      }
    }

    .footer-links {
      display: flex;
      gap: 8px;
      align-items: center;

      a {
        font-size: 13px;
        color: var(--text-secondary-color);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: var(--primary-color);
        }
      }

      .divider {
        color: var(--text-secondary-color);
      }
    }

    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        padding: 24px 16px;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-container {
        grid-template-columns: 1fr;
      }

      .footer-section h4 {
        font-size: 14px;
      }
    }
  `]
})
export class FooterComponent {}
