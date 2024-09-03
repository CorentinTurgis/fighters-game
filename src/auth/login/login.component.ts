import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  #fb: FormBuilder = inject(FormBuilder);
  #authService: AuthService = inject(AuthService);

  usernameControl = new FormControl('');
  passwordControl = new FormControl('');
  loginForm: FormGroup = this.#fb.group({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  error: string = '';

  onSubmit(): void {
    if (this.usernameControl.value && this.passwordControl.value) {
      this.#authService.login$(this.usernameControl.value, this.passwordControl.value).subscribe()
    }
  }
}