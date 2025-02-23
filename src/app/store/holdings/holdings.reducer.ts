import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { LoadingState } from '../models';
import { HoldingState, HoldingStateData } from './models';
import { holdingsEffectsActions } from './holdings.actions';

export const initialState: HoldingState = {
    data: {},
    selectedPortfolio: ''
};

const defaultState: HoldingStateData = {
    error: null,
    data: [],
    loading: false,
    loadingState: LoadingState.Initial
}

export const holdingsReducer: ActionReducer<HoldingState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(holdingsEffectsActions.portfolioSelected, (state, action) => {
        return {
            ...state,
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
    })
);
