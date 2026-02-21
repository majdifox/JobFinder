import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Favorite } from '../../../core/models/favorite.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="favorites-page">
      <div class="container">
        <div class="page-header">
          <h2><i class="bi bi-heart-fill me-2"></i>Mes Favoris</h2>
          <p class="text-muted-custom">Vos offres d'emploi sauvegardées</p>
        </div>

        <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>

        <div *ngIf="!(loading$ | async) && (favorites$ | async)?.length === 0" class="empty-state text-center">
          <i class="bi bi-heart display-1"></i>
          <h4 class="mt-3 text-light">Aucun favori</h4>
          <p class="text-muted">Ajoutez des offres à vos favoris depuis la page de recherche.</p>
        </div>

        <div *ngIf="!(loading$ | async)">
          <div class="fav-card" *ngFor="let fav of favorites$ | async">
            <div class="fav-top">
              <div class="flex-grow-1">
                <h5 class="fav-title">{{ fav.title }}</h5>
                <p class="fav-company"><i class="bi bi-building me-1"></i>{{ fav.company }}</p>
              </div>
              <span class="badge bg-source">{{ fav.apiSource }}</span>
            </div>

            <div class="fav-meta">
              <span><i class="bi bi-geo-alt"></i> {{ fav.location }}</span>
              <span><i class="bi bi-calendar3"></i> Ajouté le {{ fav.dateAdded | date:'dd/MM/yyyy' }}</span>
            </div>

            <div class="fav-actions">
              <a [href]="fav.url" target="_blank" class="btn btn-sm btn-view">
                <i class="bi bi-box-arrow-up-right me-1"></i> Voir l'offre
              </a>
              <button class="btn btn-sm btn-remove" (click)="removeFavorite(fav)">
                <i class="bi bi-heart-fill me-1"></i> Retirer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-page { padding: 2rem 0; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { color: #fff; font-weight: 700; }
    .text-muted-custom { color: rgba(255,255,255,0.5); }
    .fav-card {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.3s ease;
    }
    .fav-card:hover {
      border-color: rgba(239,68,68,0.2);
      transform: translateY(-2px);
    }
    .fav-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .fav-title { color: #fff; font-weight: 600; font-size: 1.05rem; margin-bottom: 0.2rem; }
    .fav-company { color: #8b5cf6; font-size: 0.9rem; margin-bottom: 0; }
    .bg-source {
      background: rgba(99,102,241,0.15);
      color: #a5b4fc;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .fav-meta {
      display: flex; gap: 1rem; margin: 0.8rem 0;
      color: rgba(255,255,255,0.5); font-size: 0.85rem;
    }
    .fav-meta i { color: #6366f1; margin-right: 4px; }
    .fav-actions {
      display: flex; justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-view {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; border: none; border-radius: 8px;
      text-decoration: none; font-weight: 500;
    }
    .btn-remove {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #ef4444; border-radius: 8px;
    }
    .btn-remove:hover {
      background: rgba(239,68,68,0.2);
      color: #ef4444;
    }
    .empty-state { padding: 4rem 0; }
    .empty-state i { color: rgba(255,255,255,0.1); }
  `]
})
export class FavoritesListComponent implements OnInit {
  favorites$!: Observable<Favorite[]>;
  loading$!: Observable<boolean>;

  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.favorites$ = this.store.select(selectAllFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    }
  }

  removeFavorite(fav: Favorite): void {
    if (fav.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: fav.id }));
    }
  }
}
