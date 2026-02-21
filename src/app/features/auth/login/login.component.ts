import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="auth-card">
              <div class="row g-0">
                <!-- Left: Branding -->
                <div class="col-md-6 auth-brand d-none d-md-flex">
                  <div class="brand-content">
                    <h1 class="brand-title">JobFinder</h1>
                    <p class="brand-text">Trouvez l'emploi de vos rêves parmi des milliers d'offres.</p>
                    <div class="brand-features">
                      <div class="feature"><i class="bi bi-check-circle-fill"></i> Recherche multi-sources</div>
                      <div class="feature"><i class="bi bi-check-circle-fill"></i> Sauvegardez vos favoris</div>
                      <div class="feature"><i class="bi bi-check-circle-fill"></i> Suivez vos candidatures</div>
                    </div>
                  </div>
                </div>

                <!-- Right: Form -->
                <div class="col-md-6 auth-form-side">
                  <div class="auth-form-content">
                    <h2 class="form-title">Connexion</h2>
                    <p class="form-subtitle">Entrez vos identifiants pour accéder à votre compte</p>

                    <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                      {{ errorMessage }}
                      <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                    </div>

                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                      <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" formControlName="email" placeholder="Email">
                        <label for="email"><i class="bi bi-envelope me-2"></i>Email</label>
                        <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-danger small mt-1">
                          <span *ngIf="loginForm.get('email')?.errors?.['required']">L'email est requis.</span>
                          <span *ngIf="loginForm.get('email')?.errors?.['email']">Email invalide.</span>
                        </div>
                      </div>

                      <div class="form-floating mb-4">
                        <input type="password" class="form-control" id="password" formControlName="password" placeholder="Mot de passe">
                        <label for="password"><i class="bi bi-lock me-2"></i>Mot de passe</label>
                        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-danger small mt-1">
                          L'mot de passe est requis.
                        </div>
                      </div>

                      <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="loginForm.invalid || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loading ? 'Connexion...' : 'Se connecter' }}
                      </button>
                    </form>

                    <div class="text-center mt-4">
                      <span class="text-muted">Pas encore de compte ?</span>
                      <a routerLink="/register" class="ms-1 auth-link">Créer un compte</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 140px);
      display: flex;
      align-items: center;
      padding: 2rem 0;
    }
    .auth-card {
      background: #1a1a2e;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .auth-brand {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
    }
    .brand-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 1rem;
    }
    .brand-text {
      color: rgba(255,255,255,0.85);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .brand-features .feature {
      color: rgba(255,255,255,0.9);
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }
    .brand-features .feature i {
      color: #fff;
      margin-right: 0.5rem;
    }
    .auth-form-side {
      background: #16162a;
      padding: 3rem;
      display: flex;
      align-items: center;
    }
    .auth-form-content {
      width: 100%;
    }
    .form-title {
      color: #fff;
      font-weight: 700;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .form-subtitle {
      color: rgba(255,255,255,0.5);
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }
    .form-floating .form-control {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      border-radius: 12px;
      height: 56px;
    }
    .form-floating .form-control:focus {
      background: rgba(255,255,255,0.08);
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
      color: #fff;
    }
    .form-floating label {
      color: rgba(255,255,255,0.5);
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99,102,241,0.4);
    }
    .auth-link {
      color: #8b5cf6;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-link:hover {
      color: #a78bfa;
      text-decoration: underline;
    }
    .alert-danger {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
      border-radius: 12px;
    }
    @media (max-width: 768px) {
      .auth-form-side { padding: 2rem; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/jobs';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }
}
