import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';

export const createPortfolioActions = createActionGroup({
    source: 'Create Portfolio Component',
    events: {
        showPortfolioDialogUpdated: props<{ data: boolean }>(),
        portfolioSaved: props<{ data: Portfolio }>()
    }
});

