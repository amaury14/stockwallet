import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { SectionView, SectionViewModel } from '../../store/models';
import { sidebarConfig } from './sidebar.metadata';
import { sidebarActions } from './sidebar.actions';

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    public sections: SectionViewModel[] = sidebarConfig?.sections;

    constructor(private _store: Store) { }

    onSectionSelected(section: SectionView): void {
        this._store.dispatch(sidebarActions.sectionSelected({ section }));
    }

}
