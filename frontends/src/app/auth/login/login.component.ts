import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  #authService: AuthService = inject(AuthService);

  username: string = '';
  password: string = '';
  error: string = '';

  onSubmit(): void {
    this.#authService.login$(this.username, this.password).subscribe()
  }
}
