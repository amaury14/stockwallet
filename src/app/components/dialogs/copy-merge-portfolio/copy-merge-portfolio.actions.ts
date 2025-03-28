import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';

export const copyMergePortfolioActions = createActionGroup({
    source: 'Copy Merge Portfolio Component',
    events: {
        showCopyMergePortfoliosDialogUpdated: props<{ data: boolean }>(),
        copyMergeSubmitted: props<{ data: Portfolio[]; portfolio: Portfolio }>()
    }
});

