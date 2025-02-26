import { LoadingState } from '../../models';
import { Holding } from './holding.model';

export interface HoldingStateData {
    data: Holding[];
    error: unknown;
    loading: boolean;
    loadingState: LoadingState;
    selectedHolding: Holding;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface HoldingStateInnerData {
    [key: string]: HoldingStateData;
}

export interface HoldingState {
    data: HoldingStateInnerData;
    selectedPortfolio: string;
}