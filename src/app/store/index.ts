import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { FirebaseService } from './firebase.service';
import { PortfolioEffects } from './portfolio/portfolio.effects';
import { portfolioReducer } from './portfolio/portfolio.reducer';

export * from './sw.state';

export const swReducers = {
    auth: authReducer,
    portfolio: portfolioReducer
};

export const swEffects = [
    AuthEffects,
    PortfolioEffects
];

export const swServices = [
    FirebaseService
];
