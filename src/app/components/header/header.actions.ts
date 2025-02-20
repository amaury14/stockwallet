import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const headerActions = createActionGroup({
    source: 'Header Component',
    events: {
        singOutFailed: props<{ error: unknown }>(),
        singOutSuccess: emptyProps()
    }
});
