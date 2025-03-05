import { createActionGroup, props } from '@ngrx/store';

import { Holding } from '../../../store/holdings/models';

export const portfolioActions = createActionGroup({
    source: 'Portfolio Component',
    events: {
        holdingEditSelected: props<{ data: Holding }>(),
        transactionUpdated: props<{ data: Holding }>(),
        transactionDeleted: props<{ data: Holding }>()
    }
});

