import { Injectable } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { MessageService } from 'primeng/api';
import { asyncScheduler, of, zip } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, observeOn } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { copyMergePortfolioActions } from '../../components/dialogs/copy-merge-portfolio/copy-merge-portfolio.actions';
import { createPortfolioActions } from '../../components/dialogs/create-portfolio/create-portfolio.actions';
import { mainTopBarActions } from '../../components/main-container/portfolio/main-top-bar/main-top-bar.actions';
import { loginActions } from '../../components/login/login.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { authSelectors } from '../auth/auth.selector';
import { FirebaseService } from '../firebase.service';
import { investmentTypes } from '../holdings/holdings.metadata';
import { Holding } from '../holdings/models';
import { holdingsEffectsActions } from '../holdings/holdings.actions';
import { holdingsSelectors } from '../holdings/holdings.selector';
import { dbCollectionKeys } from '../key-string.store';
import { Portfolio } from './models';
import { portfolioEffectsActions } from './portfolio.actions';
import { portfolioSelectors } from './portfolio.selector';
import { removeIdFromObject } from '../utils';

@Injectable()
export class PortfolioEffects {

    constructor(private _actions$: Actions, private _messageService: MessageService, private _store: Store, private _firebaseService: FirebaseService) { }

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
        ofType(createPortfolioActions.portfolioSaved),
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
            portfolioEffectsActions.portfolioDeleteSuccess,
            portfolioEffectsActions.copyMergeSaveHoldingsInfoSuccess
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
        ofType(holdingsEffectsActions.holdingsDeleteSuccess),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([action, user]) => !!user?.uid && !!action.portfolioId),
        mergeMap(([action, user]) => {
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            return this._firebaseService.deleteDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`,
                action.portfolioId!
            ).pipe(
                map(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Portfolio delete completed succesfully.',
                        sticky: false
                    });
                    return portfolioEffectsActions.portfolioDeleteSuccess({ data: action.portfolioId! })
                }),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioDeleteFailed({ error: 'Portfolio delete failed' }))
                )
            )
        })
    ));

    updateCashBalance$ = createEffect(() => this._actions$.pipe(
        ofType(mainTopBarActions.cashBalanceUpdated),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(portfolioSelectors.getSelected)
        ]),
        filter(([action, user, selectedPortfolio]) => action.data >= 0 && !!user?.uid && !!selectedPortfolio?.id),
        mergeMap(([action, user, selectedPortfolio]) => {
            return this._firebaseService.updateDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`,
                selectedPortfolio!.id!,
                {
                    ...selectedPortfolio,
                    cashAmount: action.data
                }
            ).pipe(
                map(() => portfolioEffectsActions.portfolioUpdatedSuccess({
                    data: {
                        ...selectedPortfolio!,
                        cashAmount: action.data
                    }
                })),
                catchError(() =>
                    of(portfolioEffectsActions.portfolioUpdatedFailed({ error: 'Portfolio failed to update' }))
                )
            )
        })
    ));

    // ==================================================================================================
    // ==================================================================================================
    // Logic to copy/merge portfolios
    copyMergeSubmitted$ = createEffect(() => this._actions$.pipe(
        ofType(copyMergePortfolioActions.copyMergeSubmitted),
        concatLatestFrom(() => [
            this._store.select(authSelectors.getUser),
            this._store.select(holdingsSelectors.holdingsFeatureSelector)
        ]),
        filter(([action, user]) => !!user?.uid && !!action.data.length && !!action.portfolio),
        concatMap(([action, user, holdingsState]) => {
            const fetchPortfolioRecords: Portfolio[] = [];
            const onSitePortfolioRecords: Holding[][] = [];
            action.data.forEach(item => {
                if (!holdingsState.data[item.id!]) {
                    fetchPortfolioRecords.push(item);
                } else {
                    onSitePortfolioRecords.push(holdingsState.data[item.id!].data);
                }
            });
            this._store.dispatch(portfolioEffectsActions.portfolioLoading());
            this._messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Copy/Merge portfolio(s) running in the background, please do not close the app.',
                sticky: false
            });
            if (fetchPortfolioRecords.length) {
                const fetchHoldingsRequests = fetchPortfolioRecords.map(fetchPortfolio =>
                    this._firebaseService.getDocuments(
                        `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${fetchPortfolio?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`
                    )
                );
                return zip(...fetchHoldingsRequests).pipe(
                    observeOn(asyncScheduler), // Run fetch in a separate async context
                    map((response) => portfolioEffectsActions.copyMergePortfoliosInfoLoaded({
                        data: action.portfolio,
                        holdings: [
                            ...(response.flat() as Holding[]).map(item => ({
                                ...item,
                                dateOfPurchase: (item.dateOfPurchase as Timestamp).toDate(),
                                imgSource: `${environment.logosUrl}${item.ticker}.png`,
                                investmentType: item.investmentType ? item.investmentType : investmentTypes[0].name
                            })),
                            ...onSitePortfolioRecords.flat()
                        ].map(record => removeIdFromObject(record) as Holding)
                    })),
                    catchError(() => {
                        this._messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: 'Copy/Merge failed to complete.',
                            sticky: false
                        });
                        return of(portfolioEffectsActions.copyMergePortfoliosInfoFailed({ error: 'Copy/Merge failed to complete' }))
                    })
                );
            }
            return zip(of([])).pipe(
                map(() => portfolioEffectsActions.copyMergePortfoliosInfoLoaded({
                    data: action.portfolio,
                    holdings: onSitePortfolioRecords.flat().map(record => removeIdFromObject(record) as Holding)
                }))
            );
        })
    ));

    addCopyMergePortfolio$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioEffectsActions.copyMergePortfoliosInfoLoaded),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([action, user]) => !!action.data && !!action.holdings.length && !!user?.uid),
        mergeMap(([action, user]) => {
            return this._firebaseService.addDocument(
                `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}`,
                action.data
            ).pipe(
                map(response => portfolioEffectsActions.copyMergePortfolioAddedSuccess({
                    data: { ...action.data, id: (response as DocumentReference<unknown>).id },
                    holdings: action.holdings
                })),
                catchError(() => {
                    this._messageService.add({
                        severity: 'danger',
                        summary: 'Error',
                        detail: 'Copy/Merge portfolio failed to save.',
                        sticky: false
                    });
                    return of(portfolioEffectsActions.copyMergePortfolioAddedFailed({ error: 'Copy/Merge portfolio failed to save' }))
                })
            )
        })
    ));

    copyMergePortfolio$ = createEffect(() => this._actions$.pipe(
        ofType(portfolioEffectsActions.copyMergePortfolioAddedSuccess),
        concatLatestFrom(() => this._store.select(authSelectors.getUser)),
        filter(([action, user]) => !!action.data && !!action.holdings.length && !!user?.uid),
        concatMap(([action, user]) => {
            const saveHoldingsRequests = action.holdings.map(saveHolding =>
                this._firebaseService.addDocument(
                    `${dbCollectionKeys.USERS_COLLECTION_KEY}/${user?.uid}/${dbCollectionKeys.PORTFOLIO_COLLECTION_KEY}/${action.data?.id}/${dbCollectionKeys.HOLDINGS_COLLECTION_KEY}`,
                    saveHolding
                )
            );
            return zip(...saveHoldingsRequests).pipe(
                observeOn(asyncScheduler), // Run save in a separate async context
                map(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Copy/Merge portfolio completed succesfully.',
                        sticky: false
                    });
                    return portfolioEffectsActions.copyMergeSaveHoldingsInfoSuccess({
                        data: action.data,
                        holdings: action.holdings
                    })
                }),
                catchError(() => {
                    this._messageService.add({
                        severity: 'danger',
                        summary: 'Error',
                        detail: 'Copy/Merge failed to complete.',
                        sticky: false
                    });
                    return of(portfolioEffectsActions.copyMergeSaveHoldingsInfoFailed({ error: 'Copy/Merge failed to complete' }))
                })
            );
        })
    ));
    // ==================================================================================================
    // ==================================================================================================
}
