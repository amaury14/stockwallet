import { Injectable } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { asyncScheduler, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, observeOn } from 'rxjs/operators';

import { portfolioActions } from '../../components/main-container/portfolio/portfolio.actions';
import { authSelectors } from '../auth/auth.selector';
import { FirebaseService } from '../firebase.service';
import { dbCollectionKeys } from '../key-string.store';
import { LoadingState } from '../models';
import { portfolioSelectors } from '../portfolio/portfolio.selector';
import { StockService } from '../stock.service';
import { holdingsEffectsActions } from './holdings.actions';
import { holdingsSelectors } from './holdings.selector';
import { Holding } from './models';

@Injectable()
export class HoldingsEffects {

    constructor(
        private _actions$: Actions,
        private _firebaseService: FirebaseService,
        private _store: Store,
        private _stockService: StockService
    ) { }

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

    transactionUpdated$ = createEffect(() => this._actions$.pipe(
        ofType(
            portfolioActions.transactionUpdated
        ),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getSelected)
        ]),
        filter(([action, user, selectedPortfolio]) => !!user?.uid && !!selectedPortfolio && !!action.data?.id),
        mergeMap(([action, user, selectedPortfolio]) =>
            this._firebaseService.updateDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${selectedPortfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`,
                action.data.id!,
                action.data
            ).pipe(
                map(() => holdingsEffectsActions.holdingUpdatedSuccess({
                    data: action.data
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingUpdateFailed({ error: 'Holding update failed' }))
                )
            )
        )
    ));

    transactionDeleted$ = createEffect(() => this._actions$.pipe(
        ofType(
            portfolioActions.transactionDeleted
        ),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getSelected)
        ]),
        filter(([action, user, selectedPortfolio]) => !!user?.uid && !!selectedPortfolio && !!action.data?.id),
        mergeMap(([action, user, selectedPortfolio]) =>
            this._firebaseService.deleteDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${selectedPortfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`,
                action.data.id!
            ).pipe(
                map(() => holdingsEffectsActions.holdingDeletedSuccess({
                    data: action.data
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingDeleteFailed({ error: 'Holding delete failed' }))
                )
            )
        )
    ));

    // Getting a deleted portfolio from delete stack,
    // Deleting each holding at a time, using a separate async context
    deleteMultipleStocks$ = createEffect(() => this._store.select(portfolioSelectors.getDeleteStack).pipe(
        filter((deleteStack) => !!deleteStack?.length),
        concatLatestFrom((deleteStack) => [
            this._store.select(authSelectors.getUser),
            this._store.select(holdingsSelectors.getHoldingsByPortfolioId(deleteStack[0]))
        ]),
        filter(([, user, holdings]) => !!user?.uid && !!holdings?.length),
        mergeMap(([deleteStack, user, holdings]) => {
            const deleteRequests = holdings.map(holding =>
                this._firebaseService.deleteDocument(
                    `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${deleteStack[0]!}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`,
                    holding.id!
                )
            );
            return zip(...deleteRequests).pipe(
                observeOn(asyncScheduler), // Run deletions in a separate async context
                map(() => holdingsEffectsActions.holdingsDeleteSuccess({ portfolioId: deleteStack[0] })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingsDeleteFailed({ error: 'Holdings delete failed' }))
                )
            );
        })
    ));

    filterTicker$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioActions.filterTicker),
        filter((action) => !!action.query),
        mergeMap((action) => {
            return this._stockService.getStockData(action.query).pipe(
                map(data => holdingsEffectsActions.filterStocksSuccess({
                    data
                })),
                catchError(() =>
                    of(holdingsEffectsActions.filterStocksFailed({ error: 'Filter stocks failed to Load' }))
                )
            )
        })
    ));
}
