import { createActionGroup, props } from '@ngrx/store';

export const calculateContributionActions = createActionGroup({
    source: 'Calculate Contribution Component',
    events: {
        showCalculateContributionDialogUpdated: props<{ data: boolean }>(),
    }
});

