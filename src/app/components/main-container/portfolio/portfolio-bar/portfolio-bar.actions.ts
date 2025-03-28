import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../../store/portfolio/models';

export const portfolioBarActions = createActionGroup({
    source: 'Portfolio Bar Component',
    events: {
        portfolioSelected: props<{ data: Portfolio }>(),
        showPortfolioDialogUpdated: props<{ data: boolean }>(),
        showCopyMergePortfoliosDialogUpdated: props<{ data: boolean }>(),
        copyMergePortfolioSelected: props<{ data: Portfolio }>()
    }
});

