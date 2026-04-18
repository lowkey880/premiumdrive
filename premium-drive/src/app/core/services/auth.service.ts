import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../../shared/interfaces/models';

const API = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'pd_token';
const REFRESH_KEY = 'pd_refresh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(TOKEN_KEY));
  isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, returnUrl = '/'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/api/auth/login/`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.access);
        localStorage.setItem(REFRESH_KEY, res.refresh);
        this.loggedIn$.next(true);
        this.router.navigateByUrl(returnUrl);
      })
    );
  }

  logout(): void {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (refresh) {
      this.http.post(`${API}/api/auth/logout/`, { refresh }).subscribe({ error: () => {} });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.user_id?.toString() || 'User';
    } catch {
      return 'User';
    }
  }

  // VIP статус считается локально по сумме цен избранных авто
  getVipStatus(totalPrice: number): { label: string; color: string } {
    if (totalPrice >= 200_000) return { label: 'Gold', color: '#c9a84c' };
    if (totalPrice >= 50_000) return { label: 'Silver', color: '#a8a8a8' };
    return { label: 'Bronze', color: '#cd7f32' };
  }
}
