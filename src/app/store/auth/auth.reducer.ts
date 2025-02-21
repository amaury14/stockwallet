import { UserInfo } from 'firebase/auth';
import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { loginActions } from '../../components/login/login.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { authEffectsActions } from './auth.actions';

export interface AuthState {
    error: unknown;
    user: UserInfo | null;
}

export const initialState: AuthState = {
    error: null,
    user: null
};

export const authReducer: ActionReducer<AuthState> = createReducer(
    initialState,
    on(authEffectsActions.userLoggedIn, (state, action) => {
        return {
            ...state,
            user: action.user,
            error: null
        };
    }),
    on(
        loginActions.loginFailed,
        loginInlineActions.loginFailed,
        (state, action) => {
            return {
                ...state,
                user: null,
                error: action.error
            };
        }),
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    })
);
