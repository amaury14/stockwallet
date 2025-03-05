import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';

export const deletePortfolioActions = createActionGroup({
    source: 'Delete Portfolio Component',
    events: {
        portfolioDeleted: props<{ data: Portfolio }>(),
        showPortfolioDeleteDialogUpdated: props<{ data: boolean }>()
    }
});

