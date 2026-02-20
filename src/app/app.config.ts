import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                              // Enable routing
    provideHttpClient(withInterceptors([errorInterceptor])), // Enable HTTP calls + error handling
    provideAnimations(),                                // Enable animations
    provideStore({ favorites: favoritesReducer }),       // Enable NgRx store for favorites
    provideEffects([FavoritesEffects]),                  // Enable NgRx side effects
    provideStoreDevtools({ maxAge: 25, logOnly: false }) // Enable Redux DevTools
  ]
};
