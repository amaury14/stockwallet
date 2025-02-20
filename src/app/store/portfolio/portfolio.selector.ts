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

export const portfolioSelectors = {
    getData,
    getError,
    getLoadingState,
    isLoading
};
