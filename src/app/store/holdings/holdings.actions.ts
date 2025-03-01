import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { StockInformation, StockProfile } from '../models';
import { Portfolio } from '../portfolio/models';
import { Holding } from './models';

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
        filterStocksSuccess: props<{ data: StockInformation[] }>(),
        filterStocksFailed: props<{ error: string }>(),
        noMoreActions: emptyProps(),
        fetchStockProfile: props<{ data: Holding }>(),
        fetchStockProfileSuccess: props<{ data: StockProfile }>(),
        fetchStockProfileFailed: props<{ error: string }>(),
        fetchStockProfilesSuccess: props<{ data: StockProfile[] }>(),
        fetchStockProfilesFailed: props<{ error: string }>()
    }
});
