import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private router: Router) { }

    canActivate(): Observable<boolean> {
        return new Observable((observer) => {
            onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    observer.next(!!user.uid);
                    observer.complete();
                } else {
                    this.router.navigate(['/']);
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }

};
