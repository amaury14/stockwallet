import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';

export const portfolioActions = createActionGroup({
    source: 'Portfolio Component',
    events: {
        portfolioSelected: props<{ data: Portfolio }>()
    }
});

