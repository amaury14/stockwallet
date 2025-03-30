import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Holding } from '../holdings/models';
import { Portfolio } from './models';

export const portfolioEffectsActions = createActionGroup({
    source: 'Portfolio Effects',
    events: {
        portfolioLoading: emptyProps(),
        portfolioLoadSuccess: props<{ data: Portfolio[] }>(),
        portfolioLoadFailed: props<{ error: string }>(),
        portfolioAddedSuccess: props<{ data: Portfolio }>(),
        portfolioAddedFailed: props<{ error: string }>(),
        portfolioDeleteSuccess: props<{ data: string }>(),
        portfolioDeleteFailed: props<{ error: string }>(),
        portfolioUpdatedSuccess: props<{ data: Portfolio }>(),
        portfolioUpdatedFailed: props<{ error: string }>(),
        copyMergePortfoliosInfoLoaded: props<{ data: Portfolio; holdings: Holding[] }>(),        
        copyMergePortfoliosInfoFailed: props<{ error: string }>(),
        copyMergePortfolioAddedSuccess: props<{ data: Portfolio; holdings: Holding[] }>(),
        copyMergePortfolioAddedFailed: props<{ error: string }>(),
        copyMergeSaveHoldingsInfoSuccess: props<{ data: Portfolio; holdings: Holding[] }>(),        
        copyMergeSaveHoldingsInfoFailed: props<{ error: string }>()
    }
});
