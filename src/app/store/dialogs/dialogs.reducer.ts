import { ActionReducer, createReducer, on } from '@ngrx/store';

import { calculateContributionActions } from '../../components/dialogs/calculate-contribution/calculate-contribution.actions';
import { createPortfolioActions } from '../../components/dialogs/create-portfolio/create-portfolio.actions';
import { deletePortfolioActions } from '../../components/dialogs/delete-portfolio/delete-portfolio.actions';
import { registerPurchaseActions } from '../../components/dialogs/register-purchase/register-purchase.actions';
import { updateContributionsActions } from '../../components/dialogs/update-contributions/update-contributions.actions';
import { headerActions } from '../../components/header/header.actions';
import { generalActions } from '../../components/main-container/portfolio/general/general.actions';
import { mainTopBarActions } from '../../components/main-container/portfolio/main-top-bar/main-top-bar.actions';
import { portfolioBarActions } from '../../components/main-container/portfolio/portfolio-bar/portfolio-bar.actions';
import { authEffectsActions } from '../auth/auth.actions';
import { DialogsStateData } from './models';

export const initialState: DialogsStateData = {
    showCalculateContributionDialog: false,
    showEditHoldingDialog: false,
    showHoldingDialog: false,
    showPortfolioDeleteDialog: false,
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
        }),
    on(
        mainTopBarActions.showHoldingDialogUpdated,
        registerPurchaseActions.showHoldingDialogUpdated,
        (state, action) => {
            return {
                ...state,
                showHoldingDialog: action.data
            };
        }),
    on(
        mainTopBarActions.showPortfolioDeleteDialogUpdated,
        deletePortfolioActions.showPortfolioDeleteDialogUpdated,
        (state, action) => {
            return {
                ...state,
                showPortfolioDeleteDialog: action.data
            };
        }),
    on(
        generalActions.showEditHoldingDialogUpdated,
        updateContributionsActions.showEditHoldingDialogUpdated,
        (state, action) => {
            return {
                ...state,
                showEditHoldingDialog: action.data
            };
        }),
    on(
        mainTopBarActions.showCalculateContributionDialogUpdated,
        calculateContributionActions.showCalculateContributionDialogUpdated,
        (state, action) => {
            return {
                ...state,
                showCalculateContributionDialog: action.data
            };
        })
);
