import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, TruncatePipe],
    template: `
    <div class="job-card" [class.is-favorite]="isFavorite">
      <div class="card-header-section">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h5 class="job-title">{{ job.title }}</h5>
            <p class="job-company">
              <i class="bi bi-building me-1"></i> {{ job.company }}
            </p>
          </div>
          <span class="badge bg-source">{{ job.apiSource }}</span>
        </div>
      </div>

      <div class="card-body-section">
        <div class="job-meta">
          <span class="meta-item">
            <i class="bi bi-geo-alt"></i> {{ job.location }}
          </span>
          <span class="meta-item">
            <i class="bi bi-calendar3"></i> {{ job.datePosted | date:'dd/MM/yyyy' }}
          </span>
          <span class="meta-item" *ngIf="job.salary !== 'Non spécifié'">
            <i class="bi bi-cash-stack"></i> {{ job.salary }}
          </span>
        </div>

        <p class="job-description">{{ job.description | truncate:180 }}</p>
      </div>

      <div class="card-actions">
        <a [href]="job.url" target="_blank" rel="noopener noreferrer" class="btn btn-view">
          <i class="bi bi-box-arrow-up-right me-1"></i> Voir l'offre
        </a>

        <div class="action-buttons" *ngIf="isAuthenticated">
          <button class="btn btn-fav" [class.active]="isFavorite" (click)="toggleFavorite.emit(job)"
                  [title]="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'">
            <i class="bi" [ngClass]="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
          </button>
          <button class="btn btn-track" [class.active]="isTracked" (click)="trackApplication.emit(job)"
                  [disabled]="isTracked"
                  [title]="isTracked ? 'Déjà suivie' : 'Suivre cette candidature'">
            <i class="bi" [ngClass]="isTracked ? 'bi-clipboard-check-fill' : 'bi-clipboard-plus'"></i>
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .job-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.3s ease;
    }
    .job-card:hover {
      border-color: rgba(99,102,241,0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .job-card.is-favorite {
      border-color: rgba(239,68,68,0.3);
    }
    .job-title {
      color: #fff;
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }
    .job-company {
      color: #8b5cf6;
      font-weight: 500;
      font-size: 0.95rem;
      margin-bottom: 0;
    }
    .bg-source {
      background: rgba(99,102,241,0.15);
      color: #a5b4fc;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1rem 0;
    }
    .meta-item {
      color: rgba(255,255,255,0.6);
      font-size: 0.85rem;
    }
    .meta-item i {
      color: #6366f1;
      margin-right: 4px;
    }
    .job-description {
      color: rgba(255,255,255,0.5);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 0;
    }
    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-view {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 8px 16px;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-view:hover {
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn-fav, .btn-track {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
      border-radius: 10px;
      padding: 8px 12px;
      transition: all 0.2s ease;
    }
    .btn-fav:hover, .btn-fav.active {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.3);
      color: #ef4444;
    }
    .btn-track:hover {
      background: rgba(34,197,94,0.15);
      border-color: rgba(34,197,94,0.3);
      color: #22c55e;
    }
    .btn-track.active {
      background: rgba(34,197,94,0.15);
      border-color: rgba(34,197,94,0.3);
      color: #22c55e;
      cursor: default;
    }
    @media (max-width: 576px) {
      .card-actions { flex-direction: column; gap: 0.8rem; }
      .btn-view { width: 100%; text-align: center; }
      .action-buttons { width: 100%; justify-content: center; }
      .job-meta { flex-direction: column; gap: 0.5rem; }
    }
  `]
})
export class JobCardComponent {
    @Input() job!: Job;
    @Input() isAuthenticated = false;
    @Input() isFavorite = false;
    @Input() isTracked = false;
    @Output() toggleFavorite = new EventEmitter<Job>();
    @Output() trackApplication = new EventEmitter<Job>();
}
