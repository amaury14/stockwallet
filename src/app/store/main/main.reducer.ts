import { ActionReducer, createReducer, on } from '@ngrx/store';

import { headerActions } from '../../components/header/header.actions';
import { sidebarActions } from '../../components/sidebar/sidebar.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { SectionView } from '../models';
import { MainState } from './models';

export const initialState: MainState = {
    sectionInView: SectionView.PORTFOLIOS
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
    })
);
