import { createReducer, on } from '@ngrx/store';
import { SearchState, initialSearchState } from './search.selectors';
import * as SearchActions from './search.actions';

export const searchReducer = createReducer(
  initialSearchState,
  on(SearchActions.searchServices, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(SearchActions.searchServicesSuccess, (state, { services }) => ({
    ...state,
    services,
    total: services.length,
    isLoading: false,
    error: null
  })),
  on(SearchActions.searchServicesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    services: []
  })),
  on(SearchActions.searchNearbyServices, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(SearchActions.searchNearbyServicesSuccess, (state, { services }) => ({
    ...state,
    services,
    total: services.length,
    isLoading: false,
    error: null
  })),
  on(SearchActions.searchNearbyServicesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    services: []
  })),
  on(SearchActions.setSearchFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter }
  })),
  on(SearchActions.clearSearchResults, (state) => ({
    ...state,
    services: [],
    filter: {},
    total: 0,
    error: null
  })),
  on(SearchActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
  on(SearchActions.setError, (state, { error }) => ({
    ...state,
    error
  }))
);
