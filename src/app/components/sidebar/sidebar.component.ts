import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { mainSelectors } from '../../store/main/main.selector';
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
export class SidebarComponent implements OnInit {

    sections: SectionViewModel[] = sidebarConfig?.sections;
    sectionInView: Signal<SectionView> = signal(SectionView.MARKET);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.sectionInView = this._store.selectSignal(mainSelectors.getSectionInView);
    }

    onSectionSelected(section: SectionViewModel): void {
        if (!section?.disabled) {
            this._store.dispatch(sidebarActions.sectionSelected({ section: section.key }));
        }
    }

}
