export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'provider' | 'admin';
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  services?: string[];
  location?: Location;
  availability?: Availability[];
  certificates?: string[];
  bankDetails?: BankDetails;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}
