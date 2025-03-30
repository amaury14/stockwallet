import { MessageService } from 'primeng/api';

import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { dialogsReducer } from './dialogs/dialogs.reducer';
import { FirebaseService } from './firebase.service';
import { HoldingsEffects } from './holdings/holdings.effects';
import { holdingsReducer } from './holdings/holdings.reducer';
import { mainReducer } from './main/main.reducer';
import { PortfolioEffects } from './portfolio/portfolio.effects';
import { portfolioReducer } from './portfolio/portfolio.reducer';

export * from './sw.state';

export const swReducers = {
    auth: authReducer,
    dialogs: dialogsReducer,
    holdings: holdingsReducer,
    main: mainReducer,
    portfolio: portfolioReducer
};

export const swEffects = [
    AuthEffects,
    HoldingsEffects,
    PortfolioEffects
];

export const swServices = [
    FirebaseService,
    MessageService
];
