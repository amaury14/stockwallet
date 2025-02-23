import { Injectable } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { portfolioActions } from '../../components/main-container/portfolio/portfolio.actions';
import { authSelectors } from '../auth/auth.selector';
import { FirebaseService } from '../firebase.service';
import { dbCollectionKeys } from '../key-string.store';
import { Holding } from './models';
import { holdingsEffectsActions } from './holdings.actions';
import { portfolioSelectors } from '../portfolio/portfolio.selector';
import { holdingsSelectors } from './holdings.selector';
import { LoadingState } from '../models';

@Injectable()
export class HoldingsEffects {

    constructor(private _actions$: Actions, private _store: Store, private _firebaseService: FirebaseService) { }

    portfolioSelected$ = createEffect(() => this._store.select(portfolioSelectors.getSelected).pipe(
        filter(portfolio => !!portfolio),
        map(portfolio => holdingsEffectsActions.portfolioSelected({
            portfolio: portfolio!
        }))
    ));

    loadDataOnPortfolioSelected$ = createEffect(() => this._actions$.pipe(
        ofType(holdingsEffectsActions.portfolioSelected),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(holdingsSelectors.getHoldings),
            this._store.select(holdingsSelectors.getLoadingState)
        ]),
        filter(([portfolio, user, data, loadingState]) =>
            !!portfolio && !!user?.uid && !data?.length && loadingState !== LoadingState.Loaded
        ),
        mergeMap(([action, user]) => {
            this._store.dispatch(holdingsEffectsActions.holdingsLoading());
            return this._firebaseService.getDocuments(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${action.portfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`
            ).pipe(
                map(response => holdingsEffectsActions.holdingsLoadSuccess({
                    data: (response as Holding[])?.map(item => ({
                        ...item,
                        dateOfPurchase: (item.dateOfPurchase as Timestamp).toDate()
                    }))
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingsLoadFailed({ error: 'Holdings failed to Load' }))
                )
            )
        })
    ));

    addItem$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioActions.holdingSaved),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getSelected)
        ]),
        filter(([, user, selectedPortfolio]) => !!user?.uid && !!selectedPortfolio),
        mergeMap(([action, user, selectedPortfolio]) =>
            this._firebaseService.addDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${selectedPortfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`,
                action.data
            ).pipe(
                map(response => holdingsEffectsActions.holdingAddedSuccess({
                    data: { ...action.data, id: (response as DocumentReference<unknown>).id }
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingAddedFailed({ error: 'Holding failed to save' }))
                )
            )
        )
    ));

    loadDataOnRefresh$ = createEffect(() => this._actions$.pipe(
        ofType(
            holdingsEffectsActions.holdingAddedSuccess
        ),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getSelected)
        ]),
        filter(([, user, selectedPortfolio]) => !!user?.uid && !!selectedPortfolio),
        mergeMap(([, user, selectedPortfolio]) =>
            this._firebaseService.getDocuments(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${selectedPortfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`
            ).pipe(
                map(response => holdingsEffectsActions.holdingsLoadSuccess({
                    data: (response as Holding[])?.map(item => ({
                        ...item,
                        dateOfPurchase: (item.dateOfPurchase as Timestamp).toDate()
                    }))
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingsLoadFailed({ error: 'Holdings failed to Load' }))
                )
            )
        )
    ));
}
