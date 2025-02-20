import { createFeatureSelector } from '@ngrx/store';

import { STOCK_WALLET_FEATURE_STATE_KEY, SWState } from './sw.state';

const getSWState = createFeatureSelector<SWState>(STOCK_WALLET_FEATURE_STATE_KEY);

export const swSelectors = {
    getSWState
};
