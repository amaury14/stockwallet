import { createActionGroup, props } from '@ngrx/store';

import { Holding } from '../../../../store/holdings/models';

export const mainContentActions = createActionGroup({
    source: 'Main Content Component',
    events: {
        holdingEditSelected: props<{ data: Holding }>(),
        showEditHoldingDialogUpdated: props<{ data: boolean }>()
    }
});

