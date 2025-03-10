import { createActionGroup, props } from '@ngrx/store';

export const mainTopBarActions = createActionGroup({
    source: 'Main Top Bar Component',
    events: {
        cashBalanceUpdated: props<{ data: number }>(),
        showCalculateContributionDialogUpdated: props<{ data: boolean }>(),
        showHoldingDialogUpdated: props<{ data: boolean }>(),
        showPortfolioDeleteDialogUpdated: props<{ data: boolean }>()
    }
});

