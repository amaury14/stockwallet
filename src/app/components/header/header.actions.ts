import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const headerActions = createActionGroup({
    source: 'LD Header Component',
    events: {
        singOutFailed: props<{ error: unknown }>(),
        singOutSuccess: emptyProps()
    }
});
