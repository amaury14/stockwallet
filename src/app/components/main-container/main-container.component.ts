import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { Portfolio } from '../../store/portfolio/models';
import { portfolioSelectors } from '../../store/portfolio/portfolio.selector';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { mainContainerActions } from './main-container.actions';

@Component({
    selector: 'app-main-container',
    imports: [
        ButtonModule,
        CardModule,
        CommonModule,
        HeaderComponent,
        SidebarComponent,
        TableModule
    ],
    templateUrl: './main-container.component.html',
    styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

    portfolio: Signal<Portfolio[]> = signal([]);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this._store.dispatch(mainContainerActions.appStarted());

        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
    }
}
