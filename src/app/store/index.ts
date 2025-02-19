import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { FirebaseService } from './firebase.service';
import { PrinterEffects } from './printer/printer.effects';
import { printerReducer } from './printer/printer.reducer';

export * from './ld.state';

export const ldReducers = {
    auth: authReducer,
    printer: printerReducer
};

export const ldEffects = [
    AuthEffects,
    PrinterEffects
];

export const ldServices = [
    FirebaseService
];
