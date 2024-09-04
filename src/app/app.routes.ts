import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { gameContainerComponent } from '../game/container/gameContainer.component';

export const routes: Routes = [
  {
    path: 'auth/register',
    loadComponent: () => import('../auth/register/register.component').then(c => c.RegisterComponent),
  },
  {
    path: 'auth/logout',
    loadComponent: () => import('../auth/logout/logout.component').then(c => c.LogoutComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('../auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'game',
    component: gameContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
];
