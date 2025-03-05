import { createSelector } from '@ngrx/store';

import { swSelectors } from '../sw.selectors';

const dialogsFeatureSelector = createSelector(
    swSelectors.getSWState,
    state => state?.dialogs
);

const showPortfolioDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showPortfolioDialog
);

const showHoldingDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showHoldingDialog
);

const showPortfolioDeleteDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showPortfolioDeleteDialog
);

const showEditHoldingDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showEditHoldingDialog
);

export const dialogsSelectors = {
    showEditHoldingDialog,
    showHoldingDialog,
    showPortfolioDeleteDialog,
    showPortfolioDialog
};
