import { Injectable } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { MessageService } from 'primeng/api';
import { asyncScheduler, of, zip } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, observeOn } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { registerPurchaseActions } from '../../components/dialogs/register-purchase/register-purchase.actions';
import { updateContributionsActions } from '../../components/dialogs/update-contributions/update-contributions.actions';
import { loginActions } from '../../components/login/login.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { authSelectors } from '../auth/auth.selector';
import { FirebaseService } from '../firebase.service';
import { dbCollectionKeys, dbCollectionValues } from '../key-string.store';
import { LoadingState, StockInformation, StockProfile } from '../models';
import { portfolioSelectors } from '../portfolio/portfolio.selector';
import { StockService } from '../stock.service';
import { holdingsEffectsActions } from './holdings.actions';
import { investmentTypes } from './holdings.metadata';
import { holdingsSelectors } from './holdings.selector';
import { Holding } from './models';

@Injectable()
export class HoldingsEffects {

    constructor(
        private _actions$: Actions,
        private _firebaseService: FirebaseService,
        private _messageService: MessageService,
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
                        dateOfPurchase: (item.dateOfPurchase as Timestamp).toDate(),
                        imgSource: `${environment.logosUrl}${item.ticker}.png`,
                        investmentType: item.investmentType ? item.investmentType : investmentTypes[0].name
                    }))
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingsLoadFailed({ error: 'Holdings failed to Load' }))
                )
            )
        })
    ));

    addItem$ = createEffect(() => this._actions$.pipe(
        ofType(registerPurchaseActions.holdingSaved),
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
                        dateOfPurchase: (item.dateOfPurchase as Timestamp).toDate(),
                        imgSource: `${environment.logosUrl}${item.ticker}.png`,
                        investmentType: item.investmentType ? item.investmentType : investmentTypes[0].name
                    }))
                })),
                catchError(() =>
                    of(holdingsEffectsActions.holdingsLoadFailed({ error: 'Holdings failed to Load' }))
                )
            )
        )
    ));

    transactionUpdated$ = createEffect(() => this._actions$.pipe(
        ofType(updateContributionsActions.transactionUpdated),
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
        ofType(updateContributionsActions.transactionDeleted),
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
        filter(([, user]) => !!user?.uid),
        concatMap(([deleteStack, user, holdings]) => {
            if (holdings?.length) {
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Removing transactions in the background, please do not close the app.',
                    sticky: false
                });
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
            }
            return zip(of([])).pipe(
                map(() => holdingsEffectsActions.holdingsDeleteSuccess({ portfolioId: deleteStack[0] }))
            );
        })
    ));

    filterTicker$ = createEffect(() => this._actions$.pipe(
        ofType(registerPurchaseActions.filterTicker),
        filter((action) => !!action.query),
        mergeMap((action) => {
            return this._firebaseService.getDocumentsByField(
                `${dbCollectionKeys.TICKERS_COLLECTION_KEY}`,
                'symbol',
                'like',
                [action.query],
                10
            ).pipe(
                map((response) => holdingsEffectsActions.filterStocksSuccess({
                    data: (response as StockInformation[]).map(item => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id, ...itemObj } = item;
                        return { ...itemObj, typeDisp: item.typeDisp ? item.typeDisp : dbCollectionValues.EQUITY_VALUE };
                    })
                })),
                catchError(() =>
                    of(holdingsEffectsActions.filterStocksFailed({ error: 'Filter stocks failed to Load' }))
                )
            )
        })
    ));

    loadStockProfiles$ = createEffect(() => this._actions$.pipe(
        ofType(
            loginActions.loginSuccess,
            loginInlineActions.loginSuccess,
            authEffectsActions.userLoggedIn
        ),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([, user]) => !!user?.uid),
        mergeMap(() =>
            this._firebaseService.getDocuments(
                `${dbCollectionKeys.STOCKS_COLLECTION_KEY}`
            ).pipe(
                map(response => holdingsEffectsActions.fetchStockProfilesSuccess({
                    data: response as StockProfile[]
                })),
                catchError(() =>
                    of(holdingsEffectsActions.fetchStockProfilesFailed({ error: 'Fetch Stock Profiles failed to Load' }))
                )
            )
        )
    ));

    // ==================================================================================================
    // ==================================================================================================
    // Logic to fetch stock profile and store it in our firebase to now need to fetch again from paid API
    checkStoredStock$ = createEffect(() => this._actions$.pipe(
        ofType(holdingsEffectsActions.holdingAddedSuccess),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([action, user]) => !!user?.uid && !!action.data?.symbol),
        mergeMap(([action]) =>
            this._firebaseService.getDocuments(
                `${dbCollectionKeys.STOCKS_COLLECTION_KEY}`
            ).pipe(
                map(response => {
                    if (!(response as StockProfile[]).find(item => item.symbol === action.data?.symbol)) {
                        return holdingsEffectsActions.fetchStockProfile({ data: action.data });
                    }
                    return holdingsEffectsActions.fetchStockProfilesSuccess({
                        data: response as StockProfile[]
                    });
                }),
                catchError(() =>
                    of(holdingsEffectsActions.fetchStockProfilesFailed({ error: 'Fetch Stock Profiles failed to Load' }))
                )
            )
        )
    ));

    fetchStockProfile$ = createEffect(() => this._actions$.pipe(
        ofType(holdingsEffectsActions.fetchStockProfile),
        filter((action) => !!action.data?.symbol),
        mergeMap((action) => {
            return this._stockService.getStockProfile(action.data.symbol!).pipe(
                map(data => holdingsEffectsActions.fetchStockProfileSuccess({
                    data
                })),
                catchError(() =>
                    of(holdingsEffectsActions.fetchStockProfileFailed({ error: 'Fetch Stock Profile failed to Load' }))
                )
            )
        })
    ));

    saveStockToDB$ = createEffect(() => this._actions$.pipe(
        ofType(holdingsEffectsActions.fetchStockProfileSuccess),
        filter((action) => !!action.data),
        mergeMap((action) =>
            this._firebaseService.addDocument(
                `${dbCollectionKeys.STOCKS_COLLECTION_KEY}`,
                action.data
            ).pipe(
                map(() => holdingsEffectsActions.noMoreActions()),
                catchError(() =>
                    of(holdingsEffectsActions.noMoreActions())
                )
            )
        )
    ));
    // ==================================================================================================
    // ==================================================================================================
}
