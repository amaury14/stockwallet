import { LoadingState } from '../../models';
import { Portfolio } from './portfolio.model';

export interface PortfolioState {
    copyMergeSelected: Portfolio | null;
    data: Portfolio[];
    deleteStack?: string[];
    error: unknown;
    loading: boolean;
    loadingState: LoadingState;
    selected: Portfolio | null;
}