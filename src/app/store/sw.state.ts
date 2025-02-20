import { AuthState } from './auth/auth.reducer';
import { PortfolioState } from './portfolio/models';

export const STOCK_WALLET_FEATURE_STATE_KEY = '[STOCK_WALLET]';

export interface SWState {
    auth: AuthState;
    portfolio: PortfolioState;
}
