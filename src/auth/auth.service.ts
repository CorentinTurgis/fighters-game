import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #API_URL = 'https://fighters-game-api.luwa.fr/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  #loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this.#loggedIn.asObservable();
  }

  register$(username: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post<any>(`${this.#API_URL}/auth/register`, {
      username, password, password_confirmation,
    }, { responseType: 'json' }).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem('auth_token', response.token);
          this.#loggedIn.next(true);
          this.router.navigate(['/game']);
        }
      }),
    );
  }

  login$(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.#API_URL}/auth/login`, { username, password }, { responseType: 'json' }).pipe(
      tap(response => {
        console.log(response);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.#loggedIn.next(true);
          this.router.navigate(['/game']);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.#loggedIn.next(true);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}