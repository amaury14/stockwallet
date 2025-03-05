import { createActionGroup, props } from '@ngrx/store';

import { Holding } from '../../../store/holdings/models';

export const registerPurchaseActions = createActionGroup({
    source: 'Register Purchase Component',
    events: {
        holdingSaved: props<{ data: Holding }>(),
        filterTicker: props<{ query: string }>(),
        showHoldingDialogUpdated: props<{ data: boolean }>()
    }
});

