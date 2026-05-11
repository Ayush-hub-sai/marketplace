import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import * as SearchActions from './search.actions';

@Injectable()
export class SearchEffects {
  private readonly apiService = inject(ApiService);
  private readonly actions$ = inject(Actions);

  searchServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchServices),
      switchMap(({ filter }) =>
        this.apiService.getServices(filter).pipe(
          map((services) => SearchActions.searchServicesSuccess({ services })),
          catchError((error) =>
            of(SearchActions.searchServicesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  searchNearbyServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchNearbyServices),
      switchMap(({ lat, lng, radius }) =>
        this.apiService.searchNearbyServices(lat, lng, radius).pipe(
          map((services) => SearchActions.searchNearbyServicesSuccess({ services })),
          catchError((error) =>
            of(SearchActions.searchNearbyServicesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
