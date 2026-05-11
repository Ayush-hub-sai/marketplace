import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor
  implements HttpInterceptor {

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          let errorMessage =
            'An error occurred';

          /**
           * SSR-safe ErrorEvent check
           */

          const isBrowserError =
            typeof ErrorEvent !== 'undefined' &&
            error.error instanceof ErrorEvent;

          if (isBrowserError) {

            errorMessage =
              `Error: ${error.error.message}`;

          } else {

            errorMessage =
              error.error?.message ||

              `Error Code: ${error.status} Message: ${error.message}`;
          }

          console.error(errorMessage);

          return throwError(
            () => ({
              status: error.status,
              message: errorMessage,
              error: error.error
            })
          );
        }
      )
    );
  }
}