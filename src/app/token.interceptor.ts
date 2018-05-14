import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';


import {ApiService} from './api.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: ApiService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: 'Basic ' + btoa('admin:district')
      }
    });
    return next.handle(request);
  }

}
