import { Injectable, signal, inject } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private readonly socketUrl = 'http://localhost:3000'; // Replace with your server URL

  isConnected = signal(false);
  connectionError = signal<string | null>(null);

  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();

  private notificationSubject = new Subject<any>();
  public notification$ = this.notificationSubject.asObservable();

  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.socketUrl, {
      query: { userId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected.set(true);
      this.connectionError.set(null);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected.set(false);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.connectionError.set(error.message);
    });

    this.socket.on('message', (data: any) => {
      this.messageSubject.next(data);
    });

    this.socket.on('notification', (data: any) => {
      this.notificationSubject.next(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected.set(false);
    }
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Chat specific methods
  sendMessage(message: any): void {
    this.emit('chat:message', message);
  }

  onMessageReceived(): Observable<any> {
    return this.message$;
  }

  onNotificationReceived(): Observable<any> {
    return this.notification$;
  }

  // Real-time updates
  subscribeToServiceUpdates(serviceId: string): void {
    this.emit('service:subscribe', { serviceId });
  }

  unsubscribeFromServiceUpdates(serviceId: string): void {
    this.emit('service:unsubscribe', { serviceId });
  }

  subscribeToBookingUpdates(bookingId: string): void {
    this.emit('booking:subscribe', { bookingId });
  }

  unsubscribeFromBookingUpdates(bookingId: string): void {
    this.emit('booking:unsubscribe', { bookingId });
  }
}
