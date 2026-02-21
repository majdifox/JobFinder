import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { JobService, JobSearchResult } from '../services/job.service';
import { JobCardComponent } from '../job-card/job-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';
import { Favorite } from '../../../core/models/favorite.model';
import { Application } from '../../../core/models/application.model';
import { ApplicationsService } from '../../applications/services/applications.service';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectIsFavorite, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="search-page">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero-section text-center">
          <h1 class="hero-title">Trouvez votre <span class="gradient-text">emploi idéal</span></h1>
          <p class="hero-subtitle">Recherchez parmi des milliers d'offres d'emploi internationales</p>
        </div>

        <!-- Search Bar -->
        <div class="search-card">
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
            <div class="row g-3 align-items-end">
              <div class="col-md-5">
                <label class="form-label text-light">
                  <i class="bi bi-search me-1"></i> Mots-clés
                </label>
                <input type="text" class="form-control form-control-lg" formControlName="keywords"
                       placeholder="Ex: Angular, Developer, Designer...">
              </div>
              <div class="col-md-4">
                <label class="form-label text-light">
                  <i class="bi bi-geo-alt me-1"></i> Localisation
                </label>
                <input type="text" class="form-control form-control-lg" formControlName="location"
                       placeholder="Ex: London, Manchester...">
              </div>
              <div class="col-md-3">
                <button type="submit" class="btn btn-primary btn-lg w-100" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Rechercher
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Results Info -->
        <div class="results-info" *ngIf="totalResults > 0">
          <span class="results-count">{{ totalResults | number }} résultats trouvés</span>
          <span class="results-page">Page {{ currentPage }}</span>
        </div>

        <!-- Loading -->
        <app-loading-spinner *ngIf="loading"></app-loading-spinner>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="alert alert-danger text-center mt-4">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
        </div>

        <!-- No Results -->
        <div *ngIf="!loading && searched && jobs.length === 0" class="no-results text-center">
          <i class="bi bi-search display-1 text-muted"></i>
          <h4 class="mt-3 text-light">Aucun résultat trouvé</h4>
          <p class="text-muted">Essayez d'autres mots-clés ou une localisation différente.</p>
        </div>

        <!-- Job Results -->
        <div *ngIf="!loading && jobs.length > 0">
          <app-job-card *ngFor="let job of jobs"
            [job]="job"
            [isAuthenticated]="isLoggedIn"
            [isFavorite]="isFav(job.id)"
            [isTracked]="isAppTracked(job.id)"
            (toggleFavorite)="onToggleFavorite($event)"
            (trackApplication)="onTrackApplication($event)">
          </app-job-card>

          <!-- Pagination -->
          <nav *ngIf="totalResults > 10" class="pagination-nav">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <a class="page-link" (click)="goToPage(currentPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li class="page-item" *ngFor="let p of getPages()" [class.active]="p === currentPage">
                <a class="page-link" (click)="goToPage(p)">{{ p }}</a>
              </li>
              <li class="page-item" [class.disabled]="currentPage >= totalPages">
                <a class="page-link" (click)="goToPage(currentPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-page { padding: 2rem 0; }
    .hero-section { margin-bottom: 2rem; }
    .hero-title {
      color: #fff; font-weight: 800; font-size: 2.5rem; margin-bottom: 0.5rem;
    }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle { color: rgba(255,255,255,0.5); font-size: 1.1rem; }
    .search-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .form-control {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff; border-radius: 12px;
    }
    .form-control:focus {
      background: rgba(255,255,255,0.08);
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
      color: #fff;
    }
    .form-control::placeholder { color: rgba(255,255,255,0.3); }
    .form-label { font-size: 0.85rem; font-weight: 500; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 12px;
      font-weight: 600; transition: all 0.3s ease;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    }
    .results-info {
      display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 1rem;
    }
    .results-count { color: rgba(255,255,255,0.7); font-weight: 500; }
    .results-page { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
    .no-results { padding: 3rem 0; }
    .no-results i { color: rgba(255,255,255,0.15); }
    .pagination-nav { margin-top: 2rem; }
    .page-item .page-link {
      background: #1a1a2e;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      border-radius: 8px;
      margin: 0 3px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .page-item.active .page-link {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-color: #6366f1; color: #fff;
    }
    .page-item .page-link:hover {
      background: rgba(99,102,241,0.2);
      border-color: rgba(99,102,241,0.4);
      color: #fff;
    }
    .page-item.disabled .page-link {
      opacity: 0.4; cursor: not-allowed;
    }
    .alert-danger {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; border-radius: 12px;
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 1.8rem; }
    }
  `]
})
export class JobSearchComponent implements OnInit {
  searchForm: FormGroup;
  jobs: Job[] = [];
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  loading = false;
  searched = false;
  errorMessage = '';
  isLoggedIn = false;

  favorites: Favorite[] = [];
  trackedApplications: Application[] = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      keywords: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        this.loadTrackedApps(user.id);
      }
    });

    this.store.select(selectAllFavorites).subscribe(favs => {
      this.favorites = favs;
    });
  }

  onSearch(): void {
    const { keywords, location } = this.searchForm.value;
    if (!keywords && !location) return;

    this.loading = true;
    this.searched = true;
    this.errorMessage = '';
    this.currentPage = 1;

    this.performSearch(keywords, location, 1);
  }

  private performSearch(keywords: string, location: string, page: number): void {
    this.jobService.searchJobs(keywords, location, page).subscribe({
      next: (result) => {
        this.jobs = result.jobs;
        this.totalResults = result.totalResults;
        this.totalPages = Math.ceil(result.totalResults / 10);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la recherche. Vérifiez vos clés API et réessayez.';
        this.loading = false;
        this.jobs = [];
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loading = true;
    const { keywords, location } = this.searchForm.value;
    this.performSearch(keywords, location, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  isFav(jobId: string): boolean {
    return this.favorites.some(f => f.offerId === jobId);
  }

  isAppTracked(jobId: string): boolean {
    return this.trackedApplications.some(a => a.offerId === jobId);
  }

  onToggleFavorite(job: Job): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const existing = this.favorites.find(f => f.offerId === job.id);
    if (existing && existing.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: existing.id }));
    } else {
      const fav: Favorite = {
        userId: user.id,
        offerId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        apiSource: job.apiSource,
        dateAdded: new Date().toISOString()
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite: fav }));
    }
  }

  onTrackApplication(job: Job): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.isAppTracked(job.id)) return;

    const app: Application = {
      userId: user.id,
      offerId: job.id,
      apiSource: job.apiSource,
      title: job.title,
      company: job.company,
      location: job.location,
      url: job.url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.applicationsService.addApplication(app).subscribe({
      next: (saved) => {
        this.trackedApplications.push(saved);
      }
    });
  }

  private loadTrackedApps(userId: number): void {
    this.applicationsService.getApplicationsByUser(userId).subscribe(apps => {
      this.trackedApplications = apps;
    });
  }
}
