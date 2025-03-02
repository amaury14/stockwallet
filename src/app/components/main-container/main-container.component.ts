import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { authSelectors } from '../../store/auth/auth.selector';
import { mainSelectors } from '../../store/main/main.selector';
import { SectionView } from '../../store/models';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { mainContainerActions } from './main-container.actions';
import { MarketComponent } from './market/market.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@Component({
    selector: 'app-main-container',
    imports: [
        ButtonModule,
        CardModule,
        CommonModule,
        DashboardComponent,
        HeaderComponent,
        MarketComponent,
        PortfolioComponent,
        SidebarComponent,
        TableModule
    ],
    templateUrl: './main-container.component.html',
    styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

    isUserLogged: Signal<boolean> = signal(false);
    sectionInView: Signal<SectionView> = signal(SectionView.MARKET);
    sections = SectionView;

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this._store.dispatch(mainContainerActions.appStarted());

        this.isUserLogged = this._store.selectSignal(authSelectors.isUserLogged);
        this.sectionInView = this._store.selectSignal(mainSelectors.getSectionInView);
    }
}
