import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  #authService: AuthService = inject(AuthService);
  #router: Router = inject(Router);

  canActivate(): boolean {
    if (this.#authService.getToken()) {
      return true;
    } else {
      this.#router.navigate(['/auth/login']);
      return false;
    }
  }
}