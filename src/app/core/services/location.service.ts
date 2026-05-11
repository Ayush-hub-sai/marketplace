import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GeoLocation, LocationData, PlaceDetails } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual key

  currentLocation = signal<GeoLocation | null>(null);
  selectedLocation = signal<LocationData | null>(null);
  locationError = signal<string | null>(null);

  private locationSubject = new BehaviorSubject<GeoLocation | null>(null);
  location$ = this.locationSubject.asObservable();

  getCurrentLocation(): Observable<GeoLocation> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const geoLocation: GeoLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            this.currentLocation.set(geoLocation);
            this.locationSubject.next(geoLocation);
            observer.next(geoLocation);
            observer.complete();
          },
          (error) => {
            const errorMsg = this.getGeolocationErrorMessage(error.code);
            this.locationError.set(errorMsg);
            observer.error(errorMsg);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        this.locationError.set('Geolocation is not supported');
        observer.error('Geolocation is not supported');
      }
    });
  }

  watchUserLocation(callback: (location: GeoLocation) => void): number {
    if (!navigator.geolocation) {
      this.locationError.set('Geolocation is not supported');
      return -1;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        const geoLocation: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        this.currentLocation.set(geoLocation);
        this.locationSubject.next(geoLocation);
        callback(geoLocation);
      },
      (error) => {
        const errorMsg = this.getGeolocationErrorMessage(error.code);
        this.locationError.set(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  stopWatchingLocation(watchId: number): void {
    if (watchId > -1) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Reverse geocoding using Google Maps API
  getAddressFromCoordinates(lat: number, lng: number): Observable<LocationData> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.GOOGLE_MAPS_API_KEY}`;
    return this.http.get<any>(url).pipe(
      tap((response: any) => {
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          const locationData: LocationData = this.parseLocationData(result);
          this.selectedLocation.set(locationData);
        }
      })
    );
  }

  // Forward geocoding using Google Maps API
  getCoordinatesFromAddress(address: string): Observable<PlaceDetails> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`;
    return this.http.get<any>(url).pipe(
      tap((response: any) => {
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          const placeDetails = this.parsePlaceDetails(result);
          this.selectedLocation.set({
            lat: placeDetails.location.lat,
            lng: placeDetails.location.lng,
            address: placeDetails.address,
            city: '',
            state: '',
            zipCode: '',
            country: placeDetails.address
          });
        }
      })
    );
  }

  // Calculate distance between two coordinates (in km)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private getGeolocationErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Permission denied to access location';
      case 2:
        return 'Position unavailable';
      case 3:
        return 'Request timeout';
      default:
        return 'Error retrieving location';
    }
  }

  private parseLocationData(result: any): LocationData {
    const addressComponents = result.address_components;
    let city = '', state = '', zipCode = '', country = '';

    addressComponents.forEach((component: any) => {
      if (component.types.includes('locality')) city = component.long_name;
      if (component.types.includes('administrative_area_level_1')) state = component.short_name;
      if (component.types.includes('postal_code')) zipCode = component.long_name;
      if (component.types.includes('country')) country = component.long_name;
    });

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address,
      city,
      state,
      zipCode,
      country
    };
  }

  private parsePlaceDetails(result: any): PlaceDetails {
    const addressComponents = result.address_components;
    let city = '', state = '', zipCode = '';

    addressComponents.forEach((component: any) => {
      if (component.types.includes('locality')) city = component.long_name;
      if (component.types.includes('administrative_area_level_1')) state = component.short_name;
      if (component.types.includes('postal_code')) zipCode = component.long_name;
    });

    return {
      placeId: result.place_id,
      name: result.address_components[0]?.long_name || '',
      address: `${city}, ${state}`,
      formattedAddress: result.formatted_address,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      types: result.types
    };
  }
}
