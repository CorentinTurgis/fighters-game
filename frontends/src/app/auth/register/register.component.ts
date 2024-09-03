import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  #authService: AuthService = inject(AuthService);

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  onSubmit(): void {
    this.#authService.register$(this.username, this.password, this.confirmPassword).subscribe();
  }
}
