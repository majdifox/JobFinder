import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./features/jobs/job-search/job-search.component').then(m => m.JobSearchComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () =>
      import('./features/applications/applications-list/applications-list.component').then(m => m.ApplicationsListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/jobs' }
];
