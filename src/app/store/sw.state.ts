import { AuthState } from './auth/auth.reducer';
import { DialogsStateData } from './dialogs/models';
import { HoldingState } from './holdings/models';
import { MainState } from './main/models';
import { PortfolioState } from './portfolio/models';

export const STOCK_WALLET_FEATURE_STATE_KEY = '[STOCK_WALLET]';

export interface SWState {
    auth: AuthState;
    dialogs: DialogsStateData;
    holdings: HoldingState;
    main: MainState;
    portfolio: PortfolioState;
}
