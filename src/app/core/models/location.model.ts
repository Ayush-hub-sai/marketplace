export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface SearchLocation extends LocationData {
  radius?: number; // search radius in km
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
}
