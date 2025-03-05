import { createActionGroup, props } from '@ngrx/store';

import { Holding } from '../../../store/holdings/models';

export const updateContributionsActions = createActionGroup({
    source: 'Update Contributions Component',
    events: {
        transactionUpdated: props<{ data: Holding }>(),
        transactionDeleted: props<{ data: Holding }>(),
        showEditHoldingDialogUpdated: props<{ data: boolean }>()
    }
});

