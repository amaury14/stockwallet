import { createActionGroup, props } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';
import { Holding } from '../../../store/holdings/models';

export const portfolioActions = createActionGroup({
    source: 'Portfolio Component',
    events: {
        portfolioDeleted: props<{ data: Portfolio }>(),
        portfolioSelected: props<{ data: Portfolio }>(),
        portfolioSaved: props<{ data: Portfolio }>(),
        holdingSaved: props<{ data: Holding }>(),
        holdingEditSelected: props<{ data: Holding }>(),
        transactionUpdated: props<{ data: Holding }>(),
        transactionDeleted: props<{ data: Holding }>()
    }
});

