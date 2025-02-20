import { Injectable } from '@angular/core';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { mainContainerActions } from '../../components/main-container/main-container.actions';
import { authSelectors } from './auth.selector';
import { authEffectsActions } from './auth.actions';

@Injectable()
export class AuthEffects {

    constructor(private _actions$: Actions, private _store: Store) { }

    loadUserInfo$ = createEffect(() => this._actions$.pipe(
        ofType(mainContainerActions.appStarted),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([, user]) => !user),
        switchMap(() => {
            return new Observable<User | null>((subscriber) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user: User | null) => {
                    subscriber.next(user);
                });
                return () => unsubscribe();
            });
        }),
        map((userInfo: User | null) => {
            if (userInfo) {
                return authEffectsActions.userLoggedIn({
                    user: {
                        ...userInfo?.providerData?.[0],
                        uid: userInfo?.uid
                    }
                });
            } else {
                return authEffectsActions.userLoggedOut();
            }
        }),
        catchError(() => of(authEffectsActions.userLoggedOut()))
    ));
}
