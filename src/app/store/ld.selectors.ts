import { createFeatureSelector } from '@ngrx/store';

import { LD_FEATURE_STATE_KEY, LdState } from './ld.state';

const getLdState = createFeatureSelector<LdState>(LD_FEATURE_STATE_KEY);

export const ldSelectors = {
    getLdState
};
