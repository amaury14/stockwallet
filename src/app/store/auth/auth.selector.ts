import { createSelector } from '@ngrx/store';

import { swSelectors } from '../sw.selectors';

const authFeatureSelector = createSelector(
    swSelectors.getSWState,
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
