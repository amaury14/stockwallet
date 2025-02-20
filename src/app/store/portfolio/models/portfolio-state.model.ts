import { LoadingState } from '../../models';
import { Portfolio } from './portfolio.model';

export interface PortfolioState {
    error: unknown;
    data: Portfolio[];
    loading: boolean;
    loadingState: LoadingState;
}