import { ActionReducer, createReducer, on } from '@ngrx/store';

import { mainContainerActions } from '../../components/main-container/main-container.actions';
import { headerActions } from '../../components/header/header.actions';
import { LoadingState, PrinterModel } from '../models';
import { authEffectsActions } from '../auth/auth.actions';
import { printerEffectsActions } from './printer.actions';

export interface PrinterState {
    error: unknown;
    printers: PrinterModel[] | null;
    loading: boolean;
    loadingState: LoadingState;
}

export const initialState: PrinterState = {
    error: null,
    printers: [],
    loading: false,
    loadingState: LoadingState.Initial
};

export const printerReducer: ActionReducer<PrinterState> = createReducer(
    initialState,
    on(headerActions.singOutSuccess, headerActions.singOutFailed, authEffectsActions.userLoggedOut, () => {
        return { ...initialState };
    }),
    on(mainContainerActions.ldStarted, state => {
        return {
            ...state,
            loading: true,
            loadingState: LoadingState.Loading
        };
    }),
    on(printerEffectsActions.printerLoadSuccess, (state, action) => {
        return {
            ...state,
            printers: action.printers,
            loading: false,
            loadingState: LoadingState.Loaded
        };
    }),
    on(printerEffectsActions.printerLoadFailed, (state, action) => {
        return {
            ...state,
            error: action.error,
            loading: false,
            loadingState: LoadingState.Errored
        };
    }),
    on(printerEffectsActions.printerAddedFailed, (state, action) => {
        return {
            ...state,
            error: action.error
        };
    }),
);
