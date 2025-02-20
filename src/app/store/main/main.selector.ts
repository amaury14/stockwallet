import { createSelector } from '@ngrx/store';

import { swSelectors } from '../sw.selectors';

const mainFeatureSelector = createSelector(
    swSelectors.getSWState,
    state => state?.main
);

const getSectionInView = createSelector(
    mainFeatureSelector,
    state => state?.sectionInView
);

export const mainSelectors = {
    getSectionInView
};
