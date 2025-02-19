import { createSelector } from '@ngrx/store';

import { ldSelectors } from '../ld.selectors';

const authFeatureSelector = createSelector(
    ldSelectors.getLdState,
    state => state?.auth
);

const getError = createSelector(
    authFeatureSelector,
    state => state?.error
);

const getUser = createSelector(
    authFeatureSelector,
    state => state?.user
);

const isUserLogged = createSelector(
    getUser,
    state => !!state?.uid
);

export const authSelectors = {
    getError,
    getUser,
    isUserLogged
};
