import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  #fb: FormBuilder = inject(FormBuilder);
  #authService: AuthService = inject(AuthService);

  usernameControl = new FormControl('');
  passwordControl = new FormControl('');
  confirmationPasswordControl = new FormControl('');
  registerForm: FormGroup = this.#fb.group({
    username: this.usernameControl,
    password: this.passwordControl,
    confirmation_password: this.confirmationPasswordControl,
  });
  error: string = '';

  onSubmit(): void {
    if (this.usernameControl.value && this.passwordControl.value && this.confirmationPasswordControl.value) {
      this.#authService.register$(
        this.usernameControl.value,
        this.passwordControl.value,
        this.confirmationPasswordControl.value,
      ).subscribe();
    }
  }
}