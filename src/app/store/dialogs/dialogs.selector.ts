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

const showCalculateContributionDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showCalculateContributionDialog
);

const showCopyMergePortfoliosDialog = createSelector(
    dialogsFeatureSelector,
    state => state?.showCopyMergePortfoliosDialog
);

export const dialogsSelectors = {
    showCalculateContributionDialog,
    showCopyMergePortfoliosDialog,
    showEditHoldingDialog,
    showHoldingDialog,
    showPortfolioDeleteDialog,
    showPortfolioDialog
};
