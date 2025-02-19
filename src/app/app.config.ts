import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { LD_FEATURE_STATE_KEY, ldEffects, ldReducers, ldServices } from './store';

export const appConfig: ApplicationConfig = {
    providers: [
        provideStore(),
        provideState(LD_FEATURE_STATE_KEY, ldReducers),
        provideHttpClient(),
        provideEffects(ldEffects),
        provideRouter(routes),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        ...ldServices
    ]
};
