import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { portfolioBarActions } from '../../components/main-container/portfolio/portfolio-bar/portfolio-bar.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { holdingsEffectsActions } from '../holdings/holdings.actions';
import { LoadingState } from '../models';
import { PortfolioState } from './models';
import { portfolioEffectsActions } from './portfolio.actions';

export const initialState: PortfolioState = {
    error: null,
    data: [],
    deleteStack: [],
    loading: false,
    loadingState: LoadingState.Initial,
    selected: null
};

export const portfolioReducer: ActionReducer<PortfolioState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(portfolioEffectsActions.portfolioLoading, state => {
        return {
            ...state,
            loading: true,
            loadingState: LoadingState.Loading
        };
    }),
    on(portfolioEffectsActions.portfolioLoadSuccess, (state, action) => {
        return {
            ...state,
            data: action.data,
            selected: !state?.selected ? action.data[0] : state?.selected,
            loading: false,
            loadingState: LoadingState.Loaded
        };
    }),
    on(
        portfolioEffectsActions.portfolioLoadFailed,
        portfolioEffectsActions.portfolioDeleteFailed,
        (state, action) => {
            return {
                ...state,
                error: action.error,
                loading: false,
                loadingState: LoadingState.Errored
            };
        }),
    on(portfolioEffectsActions.portfolioAddedFailed, (state, action) => {
        return {
            ...state,
            error: action.error
        };
    }),
    on(
        portfolioBarActions.portfolioSelected,
        portfolioEffectsActions.portfolioAddedSuccess,
        (state, action) => {
            return {
                ...state,
                selected: action.data
            };
        }),
    on(portfolioEffectsActions.portfolioDeleteSuccess, (state, action) => {
        return {
            ...state,
            selected: null,
            deleteStack: [...(state?.deleteStack ?? []), action.data.id!]
        };
    }),
    on(holdingsEffectsActions.holdingsDeleteSuccess, (state, action) => {
        return {
            ...state,
            deleteStack: state?.deleteStack?.filter(item => item !== action.portfolioId)
        };
    }),
    on(portfolioEffectsActions.portfolioUpdatedSuccess, (state, action) => {
        return {
            ...state,
            data: state?.data.map(item => {
                if (item.id === action.data.id) {
                    return { ...item, ...action.data };
                }
                return item;
            }),
            selected: action.data
        };
    })
);
