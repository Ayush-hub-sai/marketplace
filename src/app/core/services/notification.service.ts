import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Show a success notification
   */
  success(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: 'success'
    });
  }

  /**
   * Show an error notification
   */
  error(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: 'error'
    });
  }

  /**
   * Show a warning notification
   */
  warning(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: 'warning'
    });
  }

  /**
   * Show an info notification
   */
  info(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: 'info'
    });
  }

  /**
   * Add a custom notification
   */
  private addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => this.removeNotification(newNotification.id), 5000);
  }

  /**
   * Remove a notification
   */
  removeNotification(id: string): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }
}
