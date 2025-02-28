import { Injectable } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { portfolioActions } from '../../components/main-container/portfolio/portfolio.actions';
import { loginActions } from '../../components/login/login.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { authSelectors } from '../auth/auth.selector';
import { FirebaseService } from '../firebase.service';
import { dbCollectionKeys } from '../key-string.store';
import { Portfolio } from './models';
import { portfolioEffectsActions } from './portfolio.actions';
import { portfolioSelectors } from './portfolio.selector';

@Injectable()
export class PortfolioEffects {

    constructor(private _actions$: Actions, private _store: Store, private _firebaseService: FirebaseService) { }

    loadDataOnStart$ = createEffect(() => this._actions$.pipe(
        ofType(
            loginActions.loginSuccess,
            loginInlineActions.loginSuccess,
            authEffectsActions.userLoggedIn
        ),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getData)
        ]),
        filter(([, user, data]) => !!user?.uid && !data?.length),
        mergeMap(([, user]) => {
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            return this._firebaseService.getDocuments(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`
            ).pipe(
                map(response => portfolioEffectsActions.portfolioLoadSuccess({
                    data: (response as Portfolio[])?.map(item => ({
                        ...item,
                        createdAt: (item.createdAt as Timestamp).toDate()
                    }))
                })),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioLoadFailed({ error: 'Portfolio failed to Load' }))
                )
            )
        })
    ));

    addItem$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioActions.portfolioSaved),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        mergeMap(([action, user]) => {
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            return this._firebaseService.addDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`,
                action.data
            ).pipe(
                map(response => portfolioEffectsActions.portfolioAddedSuccess({ data: { ...action.data, id: (response as DocumentReference<unknown>).id } })),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioAddedFailed({ error: 'Portfolio failed to save' }))
                )
            )
        })
    ));

    loadDataOnRefresh$ = createEffect(() => this._actions$.pipe(
        ofType(
            portfolioEffectsActions.portfolioAddedSuccess,
            portfolioEffectsActions.portfolioDeleteSuccess
        ),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([, user]) => !!user?.uid),
        mergeMap(([, user]) => {
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            return this._firebaseService.getDocuments(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`
            ).pipe(
                map(response => portfolioEffectsActions.portfolioLoadSuccess({
                    data: (response as Portfolio[])?.map(item => ({
                        ...item,
                        createdAt: (item.createdAt as Timestamp).toDate()
                    }))
                })),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioLoadFailed({ error: 'Portfolio failed to Load' }))
                )
            )
        })
    ));

    portfolioDeleted$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioActions.portfolioDeleted),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([action, user]) => !!user?.uid && !!action.data?.id),
        mergeMap(([action, user]) => {
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            return this._firebaseService.deleteDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`,
                action.data.id!
            ).pipe(
                map(() => portfolioEffectsActions.portfolioDeleteSuccess({ data: action.data })),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioDeleteFailed({ error: 'Portfolio delete failed' }))
                )
            )
        })
    ));
}
