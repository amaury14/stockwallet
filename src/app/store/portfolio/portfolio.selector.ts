import { createSelector } from '@ngrx/store';

import { swSelectors } from '../sw.selectors';

const portfolioFeatureSelector = createSelector(
    swSelectors.getSWState,
    state => state?.portfolio
);

const getError = createSelector(
    portfolioFeatureSelector,
    state => state?.error
);

const isLoading = createSelector(
    portfolioFeatureSelector,
    state => state?.loading
);

const getLoadingState = createSelector(
    portfolioFeatureSelector,
    state => state?.loadingState
);

const getData = createSelector(
    portfolioFeatureSelector,
    state => state?.data
);

const getSelected = createSelector(
    portfolioFeatureSelector,
    state => state?.selected
);

const getDeleteStack = createSelector(
    portfolioFeatureSelector,
    state => state?.deleteStack ?? []
);

const getCashAmount = createSelector(
    getSelected,
    state => state?.cashAmount ?? 0
);

const getCopyMergeSelected = createSelector(
    portfolioFeatureSelector,
    state => state?.copyMergeSelected
);

export const portfolioSelectors = {
    getCashAmount,
    getCopyMergeSelected,
    getData,
    getDeleteStack,
    getError,
    getLoadingState,
    getSelected,
    isLoading
};
