import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionUser } from '../../core/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="profile-header">
              <div class="avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <h2>Mon Profil</h2>
              <p class="text-muted-custom">Gérez vos informations personnelles</p>
            </div>

            <div *ngIf="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>
            <div *ngIf="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div class="profile-card">
              <h5 class="card-section-title">Informations personnelles</h5>
              <form [formGroup]="profileForm" (ngSubmit)="onUpdate()">
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="lastName" formControlName="lastName" placeholder="Nom">
                      <label for="lastName">Nom</label>
                      <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" class="text-danger small mt-1">
                        Requis.
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="firstName" formControlName="firstName" placeholder="Prénom">
                      <label for="firstName">Prénom</label>
                      <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" class="text-danger small mt-1">
                        Requis.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="email" formControlName="email" placeholder="Email">
                  <label for="email">Email</label>
                </div>

                <div class="form-floating mb-4">
                  <input type="password" class="form-control" id="password" formControlName="password" placeholder="Nouveau mot de passe">
                  <label for="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" [disabled]="profileForm.invalid || saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                </button>
              </form>
            </div>

            <div class="profile-card danger-zone">
              <h5 class="card-section-title text-danger">Zone de danger</h5>
              <p class="text-muted-custom">Supprimer définitivement votre compte et toutes vos données.</p>
              <button class="btn btn-outline-danger" (click)="onDelete()" [disabled]="deleting">
                <i class="bi bi-trash me-2"></i>
                {{ deleting ? 'Suppression...' : 'Supprimer mon compte' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { padding: 2rem 0; }
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .avatar {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; color: #fff;
      margin: 0 auto 1rem;
    }
    .profile-header h2 { color: #fff; font-weight: 700; }
    .text-muted-custom { color: rgba(255,255,255,0.5); }
    .profile-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .card-section-title {
      color: #fff; font-weight: 600; margin-bottom: 1.5rem;
    }
    .form-floating .form-control {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; border-radius: 12px;
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
      border: none; border-radius: 12px; padding: 12px 24px;
      font-weight: 600;
    }
    .danger-zone {
      border-color: rgba(239,68,68,0.2);
    }
    .btn-outline-danger {
      border-radius: 12px;
      padding: 10px 24px;
    }
    .alert-success {
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
      color: #86efac; border-radius: 12px;
    }
    .alert-danger {
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; border-radius: 12px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: SessionUser | null = null;
  successMessage = '';
  errorMessage = '';
  saving = false;
  deleting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm = this.fb.group({
      lastName: [this.currentUser.lastName, [Validators.required]],
      firstName: [this.currentUser.firstName, [Validators.required]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: ['']
    });
  }

  onUpdate(): void {
    if (this.profileForm.invalid || !this.currentUser) return;

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updates: any = {
      lastName: this.profileForm.value.lastName,
      firstName: this.profileForm.value.firstName,
      email: this.profileForm.value.email
    };

    if (this.profileForm.value.password) {
      updates.password = this.profileForm.value.password;
    }

    this.authService.updateUser(this.currentUser.id, updates).subscribe({
      next: () => {
        this.successMessage = 'Profil mis à jour avec succès !';
        this.saving = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.saving = false;
      }
    });
  }

  onDelete(): void {
    if (!this.currentUser) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.deleting = true;
      this.authService.deleteUser(this.currentUser.id).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.deleting = false;
        }
      });
    }
  }
}
