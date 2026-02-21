import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
                <div class="col-md-5 auth-brand d-none d-md-flex">
                  <div class="brand-content">
                    <h1 class="brand-title">Rejoignez-nous</h1>
                    <p class="brand-text">Créez votre compte et commencez à explorer des milliers d'offres d'emploi.</p>
                    <div class="brand-features">
                      <div class="feature"><i class="bi bi-shield-check"></i> Inscription gratuite</div>
                      <div class="feature"><i class="bi bi-lightning"></i> Accès instantané</div>
                      <div class="feature"><i class="bi bi-star"></i> Fonctionnalités premium</div>
                    </div>
                  </div>
                </div>

                <!-- Right: Form -->
                <div class="col-md-7 auth-form-side">
                  <div class="auth-form-content">
                    <h2 class="form-title">Inscription</h2>
                    <p class="form-subtitle">Remplissez le formulaire pour créer votre compte</p>

                    <div *ngIf="errorMessage" class="alert alert-danger">
                      {{ errorMessage }}
                    </div>

                    <div *ngIf="successMessage" class="alert alert-success">
                      {{ successMessage }}
                    </div>

                    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="lastName" formControlName="lastName" placeholder="Nom">
                            <label for="lastName">Nom</label>
                            <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="text-danger small mt-1">
                              Le nom est requis.
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="firstName" formControlName="firstName" placeholder="Prénom">
                            <label for="firstName">Prénom</label>
                            <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="text-danger small mt-1">
                              Le prénom est requis.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" formControlName="email" placeholder="Email">
                        <label for="email"><i class="bi bi-envelope me-2"></i>Email</label>
                        <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-danger small mt-1">
                          <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis.</span>
                          <span *ngIf="registerForm.get('email')?.errors?.['email']">Email invalide.</span>
                        </div>
                      </div>

                      <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="password" formControlName="password" placeholder="Mot de passe">
                        <label for="password"><i class="bi bi-lock me-2"></i>Mot de passe</label>
                        <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-danger small mt-1">
                          <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis.</span>
                          <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Minimum 6 caractères.</span>
                        </div>
                      </div>

                      <div class="form-floating mb-4">
                        <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword" placeholder="Confirmer">
                        <label for="confirmPassword"><i class="bi bi-lock-fill me-2"></i>Confirmer le mot de passe</label>
                        <div *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']" class="text-danger small mt-1">
                          Les mots de passe ne correspondent pas.
                        </div>
                      </div>

                      <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="registerForm.invalid || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loading ? 'Création...' : 'Créer mon compte' }}
                      </button>
                    </form>

                    <div class="text-center mt-4">
                      <span class="text-muted">Déjà un compte ?</span>
                      <a routerLink="/login" class="ms-1 auth-link">Se connecter</a>
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
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
    }
    .brand-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 1rem;
    }
    .brand-text {
      color: rgba(255,255,255,0.85);
      font-size: 1rem;
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
    .auth-form-content { width: 100%; }
    .form-title { color: #fff; font-weight: 700; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .form-subtitle { color: rgba(255,255,255,0.5); margin-bottom: 2rem; font-size: 0.9rem; }
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
    .form-floating label { color: rgba(255,255,255,0.5); }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 12px; padding: 14px;
      font-weight: 600; font-size: 1rem; transition: all 0.3s ease;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99,102,241,0.4);
    }
    .auth-link { color: #8b5cf6; font-weight: 600; text-decoration: none; }
    .auth-link:hover { color: #a78bfa; text-decoration: underline; }
    .alert-danger {
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; border-radius: 12px;
    }
    .alert-success {
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
      color: #86efac; border-radius: 12px;
    }
    @media (max-width: 768px) {
      .auth-form-side { padding: 2rem; }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { lastName, firstName, email, password } = this.registerForm.value;
    this.authService.register({ id: 0, lastName, firstName, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }
}
