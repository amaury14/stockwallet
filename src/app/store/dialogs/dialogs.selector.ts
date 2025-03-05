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

export const dialogsSelectors = {
    showPortfolioDialog
};
