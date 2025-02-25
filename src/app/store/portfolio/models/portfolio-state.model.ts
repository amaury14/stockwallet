import { LoadingState } from '../../models';
import { Portfolio } from './portfolio.model';

export interface PortfolioState {
    error: unknown;
    data: Portfolio[];
    deleteStack?: string[];
    loading: boolean;
    loadingState: LoadingState;
    selected: Portfolio | null;
}