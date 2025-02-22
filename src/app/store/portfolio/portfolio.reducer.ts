import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { portfolioActions } from '../../components/main-container/portfolio/portfolio.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { loginActions } from '../../components/login/login.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { LoadingState } from '../models';
import { PortfolioState } from './models';
import { portfolioEffectsActions } from './portfolio.actions';

export const initialState: PortfolioState = {
    error: null,
    data: [],
    loading: false,
    loadingState: LoadingState.Initial,
    selected: null
};

export const portfolioReducer: ActionReducer<PortfolioState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(
        loginActions.loginSuccess,
        loginInlineActions.loginSuccess,
        authEffectsActions.userLoggedIn,
        portfolioEffectsActions.portfolioAddedSuccess,
        state => {
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
            loading: false,
            loadingState: LoadingState.Loaded
        };
    }),
    on(portfolioEffectsActions.portfolioLoadFailed, (state, action) => {
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
        portfolioActions.portfolioSelected,
        portfolioEffectsActions.portfolioAddedSuccess,
        (state, action) => {
            return {
                ...state,
                selected: action.data
            };
        })
);
