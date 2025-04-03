import { createActionGroup, props } from '@ngrx/store';

export const portfolioActions = createActionGroup({
    source: 'Portfolio Component',
    events: {
        showPortfolioDialogUpdated: props<{ data: boolean }>()
    }
});

