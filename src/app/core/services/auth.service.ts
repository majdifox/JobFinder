import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, SessionUser } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/users`;
    private currentUserSubject = new BehaviorSubject<SessionUser | null>(this.getCurrentUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    register(user: User): Observable<SessionUser> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
            switchMap(existing => {
                if (existing.length > 0) {
                    return throwError(() => new Error('Un compte avec cet email existe déjà.'));
                }
                return this.http.post<User>(this.apiUrl, user).pipe(
                    map(created => {
                        const sessionUser: SessionUser = {
                            id: created.id,
                            firstName: created.firstName,
                            lastName: created.lastName,
                            email: created.email
                        };
                        this.setSession(sessionUser);
                        return sessionUser;
                    })
                );
            }),
            catchError(err => throwError(() => err))
        );
    }

    login(email: string, password: string): Observable<SessionUser> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                const user = users[0];
                if (user.password !== password) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                const sessionUser: SessionUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
                this.setSession(sessionUser);
                return sessionUser;
            }),
            catchError(err => throwError(() => err))
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): SessionUser | null {
        const data = localStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    }

    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    updateUser(userId: number, updates: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${userId}`, updates).pipe(
            map(updated => {
                const sessionUser: SessionUser = {
                    id: updated.id,
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    email: updated.email
                };
                this.setSession(sessionUser);
                return updated;
            })
        );
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
            map(() => {
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                this.router.navigate(['/login']);
            })
        );
    }

    private setSession(user: SessionUser): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
