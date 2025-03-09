import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TabsModule } from 'primeng/tabs';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { tabData } from '../../../../store/holdings/holdings.metadata';
import { TabData, TabType } from '../../../../store/holdings/models';
import { StatsComponent } from '../stats/stats.component';
import { GeneralComponent } from '../general/general.component';
import { mainContentActions } from './main-content.actions';

@Component({
    selector: 'app-main-content',
    imports: [
        CommonModule,
        GeneralComponent,
        StatsComponent,
        TabsModule
    ],
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {

    selectedTab: Signal<TabData> = signal(tabData[0]);
    tabs: Signal<TabData[]> = signal([]);
    tabTypes = TabType;

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.tabs = this._store.selectSignal(holdingsSelectors.getTabs);
        this.selectedTab = this._store.selectSignal(holdingsSelectors.getSelectedTab);
    }

    onTabClicked(data: TabData): void {
        this._store.dispatch(mainContentActions.tabSelected({ data }));
    }
}
