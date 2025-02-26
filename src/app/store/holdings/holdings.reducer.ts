import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { portfolioActions } from '../../components/main-container/portfolio/portfolio.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { LoadingState } from '../models';
import { HoldingState } from './models';
import { holdingsEffectsActions } from './holdings.actions';

export const initialState: HoldingState = {
    data: {},
    selectedPortfolio: ''
};

export const holdingsReducer: ActionReducer<HoldingState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(holdingsEffectsActions.portfolioSelected, (state, action) => {
        return {
            ...state,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            selectedPortfolio: action.portfolio?.id!
        };
    }),
    on(
        holdingsEffectsActions.holdingsLoading,
        holdingsEffectsActions.holdingAddedSuccess,
        state => {
            return {
                ...state,
                data: {
                    ...state?.data,
                    [state?.selectedPortfolio]: {
                        ...state?.data[state?.selectedPortfolio],
                        loading: true,
                        loadingState: LoadingState.Loading
                    }
                }
            };
        }),
    on(holdingsEffectsActions.holdingsLoadSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: action.data,
                    loading: false,
                    loadingState: LoadingState.Loaded
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingsLoadFailed, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    error: action.error,
                    loading: false,
                    loadingState: LoadingState.Errored
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingAddedFailed, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    error: action.error
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingsDeleteSuccess, (state, action) => {
        if (state?.data[action.portfolioId]) {
            let newState = { ...state };
            const data = { ...newState?.data };
            delete data[action.portfolioId];
            newState = {
                ...newState,
                data
            };
            return { ...newState };
        }
        return state;
    }),
    on(portfolioActions.holdingEditSelected, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    selectedHolding: action.data
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingUpdatedSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: state?.data[state?.selectedPortfolio].data.map(item => {
                        if (item.id === action.data.id) {
                            return { ...action.data };
                        }
                        return item;
                    })
                }
            }
        };
    }),
    on(holdingsEffectsActions.holdingDeletedSuccess, (state, action) => {
        return {
            ...state,
            data: {
                ...state?.data,
                [state?.selectedPortfolio]: {
                    ...state?.data[state?.selectedPortfolio],
                    data: state?.data[state?.selectedPortfolio].data.filter(item => item.id !== action.data.id)
                }
            }
        };
    })
);
