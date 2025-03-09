import { LoadingState, StockInformation, StockProfile } from '../../models';
import { Holding } from './holding.model';
import { TabData } from './tab-data.model';

export interface HoldingStateData {
    data: Holding[];
    error: unknown;
    loading: boolean;
    loadingState: LoadingState;
    selectedHolding: Holding;
    selectedTab: TabData;
    tabs: TabData[];
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface HoldingStateInnerData {
    [key: string]: HoldingStateData;
}

export interface HoldingState {
    data: HoldingStateInnerData;
    filterStocks: StockInformation[];
    selectedPortfolio: string;
    stockProfiles: StockProfile[];
}