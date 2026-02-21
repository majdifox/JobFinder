import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as FavoritesActions from './favorites.actions';
import { FavoritesService } from '../../features/favorites/services/favorites.service';

@Injectable()
export class FavoritesEffects {
    constructor(
        private actions$: Actions,
        private favoritesService: FavoritesService
    ) { }

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            switchMap(({ userId }) =>
                this.favoritesService.getFavoritesByUser(userId).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(error =>
                        of(FavoritesActions.loadFavoritesFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            switchMap(({ favorite }) =>
                this.favoritesService.addFavorite(favorite).pipe(
                    map(saved => FavoritesActions.addFavoriteSuccess({ favorite: saved })),
                    catchError(error =>
                        of(FavoritesActions.addFavoriteFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            switchMap(({ favoriteId }) =>
                this.favoritesService.removeFavorite(favoriteId).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ favoriteId })),
                    catchError(error =>
                        of(FavoritesActions.removeFavoriteFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
