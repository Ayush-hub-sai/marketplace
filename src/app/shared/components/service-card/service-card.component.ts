import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ServiceListing } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    RouterModule
  ],
  template: `
    <mat-card class="service-card" matRipple>
      <div class="card-image">
        <img
          [src]="service?.images?.[0] || 'assets/placeholder.jpg'"
          [alt]="service?.name"
          class="image"
        />
        <div class="card-overlay">
          <button
            mat-fab
            class="view-btn"
            [routerLink]="['/service', service?.id]"
          >
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
        <div class="badge" *ngIf="service?.distance">
          {{ service?.distance | number : '1.1-1' }} km away
        </div>
      </div>

      <mat-card-content class="card-content">
        <h3 class="service-name">{{ service?.name }}</h3>

        <div class="provider-info">
          <img
            [src]="service?.provider?.avatar || 'https://i.pravatar.cc/150?img=3'"
            [alt]="service?.provider?.name"
            class="provider-avatar"
          />
          <div class="provider-details">
            <p class="provider-name">{{ service?.provider?.name }}</p>
            <p class="provider-role">
              {{ service?.provider?.role | titlecase }}
            </p>
          </div>
        </div>

        <div class="service-meta">
          <div class="rating">
            <mat-icon class="star">star</mat-icon>
            <span>{{ service?.rating | number : '1.1-1' }}</span>
            <span class="review-count">({{ service?.reviewCount }} reviews)</span>
          </div>
          <div class="price">
            <span class="currency">₹</span>
            <span class="amount">{{ service?.price | number : '1.0-0' }}</span>
          </div>
        </div>

        <p class="description">{{ service?.description | slice : 0 : 80 }}...</p>

        <div class="card-actions">
          <button mat-raised-button color="primary" class="book-btn">
            Book Now
          </button>
          <button
            mat-icon-button
            class="favorite-btn"
            [class.favorited]="isFavorited"
            (click)="toggleFavorite()"
          >
            <mat-icon>{{ isFavorited ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .service-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      }
    }

    .card-image {
      position: relative;
      overflow: hidden;
      height: 200px;
      background: var(--background-color);
    }

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .card-image:hover .image {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card-image:hover .card-overlay {
      opacity: 1;
    }

    .view-btn {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--accent-color);
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .service-name {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .provider-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .provider-details {
      flex: 1;
      min-width: 0;
    }

    .provider-name {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-role {
      margin: 0;
      font-size: 12px;
      color: var(--text-secondary-color);
    }

    .service-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text-color);
    }

    .star {
      color: #ffb400;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .review-count {
      color: var(--text-secondary-color);
      font-size: 11px;
    }

    .price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-weight: 700;
      color: var(--primary-color);
    }

    .currency {
      font-size: 12px;
    }

    .amount {
      font-size: 18px;
    }

    .description {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.4;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .book-btn {
      flex: 1;
      text-transform: none;
    }

    .favorite-btn {
      flex-shrink: 0;

      &.favorited mat-icon {
        color: var(--accent-color);
      }
    }
  `]
})
export class ServiceCardComponent {
  @Input() service: ServiceListing | null = null;
  isFavorited = false;

  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
    // Implement favorite functionality
  }
}
