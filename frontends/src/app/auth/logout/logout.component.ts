import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  #authService: AuthService = inject(AuthService);

    ngOnInit(): void {
      this.#authService.logout();
    }

}
