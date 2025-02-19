import { createSelector } from '@ngrx/store';

import { ldSelectors } from '../ld.selectors';

const printerFeatureSelector = createSelector(
    ldSelectors.getLdState,
    state => state?.printer
);

const getError = createSelector(
    printerFeatureSelector,
    state => state?.error
);

const isLoading = createSelector(
    printerFeatureSelector,
    state => state?.loading
);

const getLoadingState = createSelector(
    printerFeatureSelector,
    state => state?.loadingState
);

const getPrinters = createSelector(
    printerFeatureSelector,
    state => state?.printers
);

export const printerSelectors = {
    getError,
    getLoadingState,
    getPrinters,
    isLoading
};
