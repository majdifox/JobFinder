import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Une erreur est survenue.';

            if (error.status === 0) {
                message = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
            } else if (error.status === 404) {
                message = 'Ressource non trouvée.';
            } else if (error.status === 500) {
                message = 'Erreur interne du serveur.';
            } else if (error.error?.message) {
                message = error.error.message;
            }

            console.error(`[HTTP Error] ${error.status}: ${message}`, error);
            return throwError(() => new Error(message));
        })
    );
};
