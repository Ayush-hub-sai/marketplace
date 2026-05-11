import { createAction, props } from '@ngrx/store';
import { ServiceListing, ServiceFilter } from '../../../core/models/service.model';

export const searchServices = createAction(
  '[Search] Search Services',
  props<{ filter: ServiceFilter }>()
);

export const searchServicesSuccess = createAction(
  '[Search] Search Services Success',
  props<{ services: ServiceListing[] }>()
);

export const searchServicesFailure = createAction(
  '[Search] Search Services Failure',
  props<{ error: string }>()
);

export const searchNearbyServices = createAction(
  '[Search] Search Nearby Services',
  props<{ lat: number; lng: number; radius?: number }>()
);

export const searchNearbyServicesSuccess = createAction(
  '[Search] Search Nearby Services Success',
  props<{ services: ServiceListing[] }>()
);

export const searchNearbyServicesFailure = createAction(
  '[Search] Search Nearby Services Failure',
  props<{ error: string }>()
);

export const setSearchFilter = createAction(
  '[Search] Set Search Filter',
  props<{ filter: Partial<ServiceFilter> }>()
);

export const clearSearchResults = createAction(
  '[Search] Clear Search Results'
);

export const setLoading = createAction(
  '[Search] Set Loading',
  props<{ isLoading: boolean }>()
);

export const setError = createAction(
  '[Search] Set Error',
  props<{ error: string | null }>()
);
