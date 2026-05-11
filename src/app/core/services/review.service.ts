import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = '/api/reviews';

  constructor(private http: HttpClient) {}

  /**
   * Get reviews for a service
   */
  getServiceReviews(serviceId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  /**
   * Create a new review
   */
  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  /**
   * Update a review
   */
  updateReview(id: string, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  /**
   * Delete a review
   */
  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get user reviews
   */
  getUserReviews(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }
}
