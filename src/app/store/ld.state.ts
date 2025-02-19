import { AuthState } from './auth/auth.reducer';
import { PrinterState } from './printer/printer.reducer';

export const LD_FEATURE_STATE_KEY = '[LD]';

export interface LdState {
    auth: AuthState;
    printer: PrinterState;
}
