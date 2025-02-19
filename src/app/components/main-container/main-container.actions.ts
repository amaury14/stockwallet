import { createActionGroup, emptyProps } from '@ngrx/store';

export const mainContainerActions = createActionGroup({
    source: 'LD Main Container Component',
    events: {
        ldStarted: emptyProps()
    }
});

