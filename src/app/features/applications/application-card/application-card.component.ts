import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
    selector: 'app-application-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="app-card" [class]="'status-' + application.status">
      <div class="card-top">
        <div class="flex-grow-1">
          <h5 class="app-title">{{ application.title }}</h5>
          <p class="app-company"><i class="bi bi-building me-1"></i>{{ application.company }}</p>
        </div>
        <div class="status-badge" [class]="'badge-' + application.status">
          {{ getStatusLabel(application.status) }}
        </div>
      </div>

      <div class="app-meta">
        <span><i class="bi bi-geo-alt"></i> {{ application.location }}</span>
        <span><i class="bi bi-calendar3"></i> {{ application.dateAdded | date:'dd/MM/yyyy' }}</span>
      </div>

      <!-- Status Change -->
      <div class="status-section">
        <label class="form-label text-light small">Statut :</label>
        <select class="form-select form-select-sm" 
                [(ngModel)]="application.status"
                (ngModelChange)="onStatusChange()">
          <option value="en_attente">En attente</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <label class="form-label text-light small">Notes :</label>
        <textarea class="form-control" rows="2"
                  [(ngModel)]="application.notes"
                  placeholder="Ajouter des notes personnelles..."
                  (blur)="onNotesChange()"></textarea>
      </div>

      <div class="card-bottom">
        <a [href]="application.url" target="_blank" class="btn btn-sm btn-view">
          <i class="bi bi-box-arrow-up-right me-1"></i> Voir l'offre
        </a>
        <button class="btn btn-sm btn-delete" (click)="onDelete()">
          <i class="bi bi-trash me-1"></i> Supprimer
        </button>
      </div>
    </div>
  `,
    styles: [`
    .app-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.3s ease;
    }
    .app-card:hover {
      border-color: rgba(99,102,241,0.2);
    }
    .app-card.status-accepte { border-left: 4px solid #22c55e; }
    .app-card.status-refuse { border-left: 4px solid #ef4444; }
    .app-card.status-en_attente { border-left: 4px solid #f59e0b; }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .app-title { color: #fff; font-weight: 600; font-size: 1.05rem; margin-bottom: 0.2rem; }
    .app-company { color: #8b5cf6; font-size: 0.9rem; margin-bottom: 0; }
    .status-badge {
      padding: 4px 12px; border-radius: 20px;
      font-size: 0.75rem; font-weight: 600; white-space: nowrap;
    }
    .badge-en_attente { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .badge-accepte { background: rgba(34,197,94,0.15); color: #22c55e; }
    .badge-refuse { background: rgba(239,68,68,0.15); color: #ef4444; }
    .app-meta {
      display: flex; gap: 1rem; margin: 0.8rem 0;
      color: rgba(255,255,255,0.5); font-size: 0.85rem;
    }
    .app-meta i { color: #6366f1; margin-right: 4px; }
    .status-section, .notes-section { margin-bottom: 1rem; }
    .form-select {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; border-radius: 10px;
    }
    .form-select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }
    .form-select option { background: #1a1a2e; color: #fff; }
    .form-control {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; border-radius: 10px; font-size: 0.9rem;
    }
    .form-control:focus {
      background: rgba(255,255,255,0.08);
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
      color: #fff;
    }
    .form-control::placeholder { color: rgba(255,255,255,0.3); }
    .card-bottom {
      display: flex; justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-view {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; border: none; border-radius: 8px;
      text-decoration: none; font-weight: 500;
    }
    .btn-delete {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #ef4444; border-radius: 8px;
    }
    .btn-delete:hover {
      background: rgba(239,68,68,0.2);
      color: #ef4444;
    }
  `]
})
export class ApplicationCardComponent {
    @Input() application!: Application;
    @Output() statusChanged = new EventEmitter<{ id: number; status: ApplicationStatus }>();
    @Output() notesChanged = new EventEmitter<{ id: number; notes: string }>();
    @Output() deleted = new EventEmitter<number>();

    getStatusLabel(status: ApplicationStatus): string {
        const labels: Record<ApplicationStatus, string> = {
            'en_attente': 'En attente',
            'accepte': 'Accepté',
            'refuse': 'Refusé'
        };
        return labels[status];
    }

    onStatusChange(): void {
        if (this.application.id) {
            this.statusChanged.emit({ id: this.application.id, status: this.application.status });
        }
    }

    onNotesChange(): void {
        if (this.application.id) {
            this.notesChanged.emit({ id: this.application.id, notes: this.application.notes });
        }
    }

    onDelete(): void {
        if (this.application.id && confirm('Supprimer cette candidature du suivi ?')) {
            this.deleted.emit(this.application.id);
        }
    }
}
