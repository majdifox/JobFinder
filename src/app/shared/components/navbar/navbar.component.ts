import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-navbar fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center" routerLink="/jobs">
          <i class="bi bi-briefcase-fill me-2"></i>
          JobFinder
        </a>

        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}">
                <i class="bi bi-search me-1"></i> Rechercher
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" routerLink="/favorites" routerLinkActive="active">
                <i class="bi bi-heart-fill me-1"></i> Favoris
              </a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" routerLink="/applications" routerLinkActive="active">
                <i class="bi bi-clipboard-check me-1"></i> Candidatures
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <ng-container *ngIf="isLoggedIn; else notLoggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/profile" routerLinkActive="active">
                  <i class="bi bi-person-circle me-1"></i> {{ userName }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link btn-logout" role="button" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-1"></i> Déconnexion
                </a>
              </li>
            </ng-container>
            <ng-template #notLoggedIn>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  Connexion
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link btn-register" routerLink="/register" routerLinkActive="active">
                  Inscription
                </a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .bg-navbar {
      background: rgba(15, 15, 25, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 0.8rem 0;
    }
    .navbar-brand {
      font-size: 1.4rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nav-link {
      color: rgba(255,255,255,0.7) !important;
      font-weight: 500;
      transition: all 0.2s ease;
      padding: 0.5rem 1rem !important;
      border-radius: 8px;
      margin: 0 2px;
    }
    .nav-link:hover, .nav-link.active {
      color: #fff !important;
      background: rgba(99,102,241,0.15);
    }
    .btn-register {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff !important;
      border-radius: 10px !important;
      padding: 0.5rem 1.2rem !important;
    }
    .btn-register:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-logout {
      cursor: pointer;
    }
  `]
})
export class NavbarComponent {
    isLoggedIn = false;
    userName = '';

    constructor(private authService: AuthService) {
        this.authService.currentUser$.subscribe(user => {
            this.isLoggedIn = !!user;
            this.userName = user ? `${user.firstName} ${user.lastName}` : '';
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
