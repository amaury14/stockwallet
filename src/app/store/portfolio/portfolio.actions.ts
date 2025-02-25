import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Portfolio } from './models';

export const portfolioEffectsActions = createActionGroup({
    source: 'Portfolio Effects',
    events: {
        portfolioLoading: emptyProps(),
        portfolioLoadSuccess: props<{ data: Portfolio[] }>(),
        portfolioLoadFailed: props<{ error: string }>(),
        portfolioAddedSuccess: props<{ data: Portfolio }>(),
        portfolioAddedFailed: props<{ error: string }>(),
        portfolioDeleteSuccess: props<{ data: Portfolio }>(),
        portfolioDeleteFailed: props<{ error: string }>()
    }
});
