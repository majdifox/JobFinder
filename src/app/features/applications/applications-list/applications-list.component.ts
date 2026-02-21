import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from '../services/applications.service';
import { ApplicationCardComponent } from '../application-card/application-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, ApplicationCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="applications-page">
      <div class="container">
        <div class="page-header">
          <h2><i class="bi bi-clipboard-check me-2"></i>Suivi des Candidatures</h2>
          <p class="text-muted-custom">Suivez l'avancement de toutes vos candidatures</p>
        </div>

        <!-- Stats Cards -->
        <div class="row g-3 mb-4" *ngIf="applications.length > 0">
          <div class="col-md-4">
            <div class="stat-card stat-pending">
              <div class="stat-number">{{ countByStatus('en_attente') }}</div>
              <div class="stat-label">En attente</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card stat-accepted">
              <div class="stat-number">{{ countByStatus('accepte') }}</div>
              <div class="stat-label">Acceptées</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card stat-rejected">
              <div class="stat-number">{{ countByStatus('refuse') }}</div>
              <div class="stat-label">Refusées</div>
            </div>
          </div>
        </div>

        <app-loading-spinner *ngIf="loading"></app-loading-spinner>

        <div *ngIf="!loading && applications.length === 0" class="empty-state text-center">
          <i class="bi bi-clipboard-x display-1"></i>
          <h4 class="mt-3 text-light">Aucune candidature suivie</h4>
          <p class="text-muted">Commencez par rechercher des offres et suivez vos candidatures.</p>
        </div>

        <div *ngIf="!loading && applications.length > 0">
          <app-application-card *ngFor="let app of applications"
                                [application]="app"
                                (statusChanged)="onStatusChange($event)"
                                (notesChanged)="onNotesChange($event)"
                                (deleted)="onDelete($event)">
          </app-application-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-page { padding: 2rem 0; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { color: #fff; font-weight: 700; }
    .text-muted-custom { color: rgba(255,255,255,0.5); }
    .stat-card {
      background: #1a1a2e; border-radius: 14px; padding: 1.2rem;
      text-align: center; border: 1px solid rgba(255,255,255,0.06);
    }
    .stat-number { font-size: 2rem; font-weight: 800; }
    .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
    .stat-pending .stat-number { color: #f59e0b; }
    .stat-accepted .stat-number { color: #22c55e; }
    .stat-rejected .stat-number { color: #ef4444; }
    .empty-state { padding: 4rem 0; }
    .empty-state i { color: rgba(255,255,255,0.1); }
  `]
})
export class ApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(
    private applicationsService: ApplicationsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.applicationsService.getApplicationsByUser(user.id).subscribe({
        next: (apps) => {
          this.applications = apps;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  countByStatus(status: ApplicationStatus): number {
    return this.applications.filter(a => a.status === status).length;
  }

  onStatusChange(event: { id: number; status: ApplicationStatus }): void {
    this.applicationsService.updateApplication(event.id, { status: event.status }).subscribe();
  }

  onNotesChange(event: { id: number; notes: string }): void {
    this.applicationsService.updateApplication(event.id, { notes: event.notes }).subscribe();
  }

  onDelete(id: number): void {
    this.applicationsService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(a => a.id !== id);
      }
    });
  }
}
