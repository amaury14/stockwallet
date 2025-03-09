import { createActionGroup, props } from '@ngrx/store';

import { Holding } from '../../../../store/holdings/models';

export const generalActions = createActionGroup({
    source: 'General Component',
    events: {
        holdingEditSelected: props<{ data: Holding }>(),
        showEditHoldingDialogUpdated: props<{ data: boolean }>()
    }
});

