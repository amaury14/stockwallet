import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { loginActions } from '../../components/login/login.actions';
import { loginInlineActions } from '../../components/login-inline/login-inline.actions';
import { sidebarActions } from '../../components/sidebar/sidebar.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { SectionView } from '../models';
import { MainState } from './models';

export const initialState: MainState = {
    sectionInView: SectionView.MARKET
};

export const mainReducer: ActionReducer<MainState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(sidebarActions.sectionSelected, (state, action) => {
        return {
            ...state,
            sectionInView: action.section
        };
    }),
    on(loginActions.loginSuccess,
        loginInlineActions.loginSuccess,
        authEffectsActions.userLoggedIn, state => {
            return {
                ...state,
                sectionInView: SectionView.PORTFOLIOS
            };
        }
    )
);
