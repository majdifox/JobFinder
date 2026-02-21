import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../../../core/models/favorite.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
    private apiUrl = `${environment.apiUrl}/favoritesOffers`;

    constructor(private http: HttpClient) { }

    getFavoritesByUser(userId: number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: Favorite): Observable<Favorite> {
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(favoriteId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
    }
}
