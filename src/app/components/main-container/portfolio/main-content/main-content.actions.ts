import { createActionGroup, props } from '@ngrx/store';

import { TabData } from '../../../../store/holdings/models';

export const mainContentActions = createActionGroup({
    source: 'Main Content Component',
    events: {
        tabSelected: props<{ data: TabData }>()
    }
});

