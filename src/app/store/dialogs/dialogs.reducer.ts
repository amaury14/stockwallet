import { ActionReducer, createReducer, on } from '@ngrx/store';

import { createPortfolioActions } from '../../components/dialogs/create-portfolio/create-portfolio.actions';
import { headerActions } from '../../components/header/header.actions';
import { portfolioBarActions } from '../../components/main-container/portfolio/portfolio-bar/portfolio-bar.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { DialogsStateData } from './models';

export const initialState: DialogsStateData = {
    showPortfolioDialog: false
};

export const dialogsReducer: ActionReducer<DialogsStateData> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(
        portfolioBarActions.showPortfolioDialogUpdated,
        createPortfolioActions.showPortfolioDialogUpdated,
        (state, action) => {
        return {
            ...state,
            showPortfolioDialog: action.data
        };
    })
);
