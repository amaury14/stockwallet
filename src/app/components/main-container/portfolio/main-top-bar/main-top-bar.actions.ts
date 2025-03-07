import { createActionGroup, props } from '@ngrx/store';

export const mainTopBarActions = createActionGroup({
    source: 'Main Top Bar Component',
    events: {
        showCalculateContributionDialogUpdated: props<{ data: boolean }>(),
        showHoldingDialogUpdated: props<{ data: boolean }>(),
        showPortfolioDeleteDialogUpdated: props<{ data: boolean }>()
    }
});

