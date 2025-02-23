import { LoadingState } from '../../models';
import { Holding } from './holding.model';

export interface HoldingStateData {
    data: Holding[];
    error: unknown;
    loading: boolean;
    loadingState: LoadingState;
}

export interface HoldingState {
    data: {
        [key: string]: HoldingStateData;
    };
    selectedPortfolio: string;
}