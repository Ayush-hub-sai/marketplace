import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface SearchState {
  services: any[];
  filter: any;
  isLoading: boolean;
  error: string | null;
  total: number;
}

export const initialSearchState: SearchState = {
  services: [],
  filter: {},
  isLoading: false,
  error: null,
  total: 0
};

export const selectSearchState = createFeatureSelector<SearchState>('search');

export const selectServices = createSelector(
  selectSearchState,
  (state: SearchState) => state.services
);

export const selectSearchFilter = createSelector(
  selectSearchState,
  (state: SearchState) => state.filter
);

export const selectIsLoading = createSelector(
  selectSearchState,
  (state: SearchState) => state.isLoading
);

export const selectError = createSelector(
  selectSearchState,
  (state: SearchState) => state.error
);

export const selectTotal = createSelector(
  selectSearchState,
  (state: SearchState) => state.total
);

export const selectServiceCount = createSelector(
  selectServices,
  (services: any[]) => services.length
);
