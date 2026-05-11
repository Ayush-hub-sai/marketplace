import { Service } from './service.model';
import { User } from './user.model';

export interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  customerId: string;
  customer: User;
  providerId: string;
  provider: User;
  bookingDate: Date;
  serviceDate: Date;
  status: BookingStatus;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet'
}

export interface BookingChat {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: Date;
}
