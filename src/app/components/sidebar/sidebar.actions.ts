import { createActionGroup, props } from '@ngrx/store';

import { SectionView } from '../../store/models';

export const sidebarActions = createActionGroup({
    source: 'Sidebar Component',
    events: {
        sectionSelected: props<{ section: SectionView }>()
    }
});
