import { createActionGroup, props } from '@ngrx/store';

export const mainTopBarActions = createActionGroup({
    source: 'Main Top Bar Component',
    events: {
        showHoldingDialogUpdated: props<{ data: boolean }>(),
        showPortfolioDeleteDialogUpdated: props<{ data: boolean }>()
    }
});

