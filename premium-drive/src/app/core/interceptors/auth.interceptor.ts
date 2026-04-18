import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const SKIP_AUTH_URLS = ['/api/auth/login/'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isSkipped = SKIP_AUTH_URLS.some(url => req.url.includes(url));
    const token = this.auth.getToken();

    if (token && !isSkipped) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Токен истёк — очищаем локальное состояние и редиректим
          localStorage.removeItem('pd_token');
          localStorage.removeItem('pd_refresh');
          this.router.navigate(['/login'], {
            queryParams: { sessionExpired: true },
          });
        }
        return throwError(() => err);
      })
    );
  }
}
