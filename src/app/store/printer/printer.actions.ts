import { createActionGroup, props } from '@ngrx/store';

import { PrinterModel } from '../models';

export const printerEffectsActions = createActionGroup({
    source: 'LD Printer Effects',
    events: {
        mockAction: props<{ printer: PrinterModel }>(),
        printerLoadSuccess: props<{ printers: PrinterModel[] }>(),
        printerLoadFailed: props<{ error: string }>(),
        printerAddedSuccess: props<{ printer: PrinterModel }>(),
        printerAddedFailed: props<{ error: string }>()
    }
});
