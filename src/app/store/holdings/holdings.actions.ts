import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Holding } from './models';
import { Portfolio } from '../portfolio/models';

export const holdingsEffectsActions = createActionGroup({
    source: 'Holdings Effects',
    events: {
        portfolioSelected: props<{ portfolio: Portfolio }>(),
        holdingsLoading: emptyProps(),
        holdingsLoadSuccess: props<{ data: Holding[] }>(),
        holdingsLoadFailed: props<{ error: string }>(),
        holdingAddedSuccess: props<{ data: Holding }>(),
        holdingAddedFailed: props<{ error: string }>(),
        holdingsDeleteSuccess: props<{ portfolioId: string }>(),
        holdingsDeleteFailed: props<{ error: string }>(),
        holdingUpdatedSuccess: props<{ data: Holding }>(),
        holdingUpdateFailed: props<{ error: string }>(),
        holdingDeletedSuccess: props<{ data: Holding }>(),
        holdingDeleteFailed: props<{ error: string }>(),
        filterStocksSuccess: props<{ data: any }>(),
        filterStocksFailed: props<{ error: string }>()
    }
});
