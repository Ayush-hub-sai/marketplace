import { User } from './user.model';

export interface ServiceModel {
  id: string | any | number;
  name: string;
  description: string;
  category: ServiceCategory;
  categoryName?: string;
  provider: User;
  providerId: string;
  providerName: string;
  providerImage?: string;
  providerBio?: string;
  providerRating?: number;
  providerReviewCount?: number;
  price: number;
  originalPrice?: number;
  tax?: number;
  taxPercent?: number;
  rating: number;
  reviewCount: number;
  completedJobs?: number;
  images: string[];
  tags?: string[];
  features?: string[];
  specifications?: Array<{ key: string; value: string }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service extends ServiceModel {
  // Alias for backward compatibility
}

export interface ServiceListing extends ServiceModel {
  distance?: number; // in km
  availability?: string;
  responseTime?: string;
}

export interface ServiceCategory {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  serviceCount?: number;
}

export enum ServiceCategoryEnum {
  ELECTRICIAN = 'electrician',
  PLUMBER = 'plumber',
  TUTOR = 'tutor',
  CARPENTER = 'carpenter',
  PAINTER = 'painter',
  CLEANER = 'cleaner',
  GARDENER = 'gardener',
  MECHANIC = 'mechanic',
  PEST_CONTROL = 'pest_control',
  AC_REPAIR = 'ac_repair',
  LOCKSMITH = 'locksmith',
  MOBILE_REPAIR = 'mobile_repair',
  OTHER = 'other'
}

export interface ServiceFilter {
  category?: ServiceCategoryEnum[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxDistance?: number;
  searchQuery?: string;
  sortBy?: 'rating' | 'price' | 'distance' | 'newest';
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}
