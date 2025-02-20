import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from './models';

export const portfolioEffectsActions = createActionGroup({
    source: 'Portfolio Effects',
    events: {
        mockAction: props<{ data: Portfolio }>(),
        portfolioLoadSuccess: props<{ data: Portfolio[] }>(),
        portfolioLoadFailed: props<{ error: string }>(),
        portfolioAddedSuccess: props<{ data: Portfolio }>(),
        portfolioAddedFailed: props<{ error: string }>()
    }
});
