import { createActionGroup, emptyProps } from '@ngrx/store';

export const mainContainerActions = createActionGroup({
    source: 'Main Container Component',
    events: {
        appStarted: emptyProps()
    }
});

