import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { Holding } from '../../../../store/holdings/models';
import { PortfolioStats } from '../../../../store/models';
import { Portfolio } from '../../../../store/portfolio/models';
import { portfolioSelectors } from '../../../../store/portfolio/portfolio.selector';
import { mainTopBarActions } from './main-top-bar.actions';

@Component({
    selector: 'app-main-top-bar',
    imports: [
        ButtonModule,
        CommonModule,
        ToolbarModule
    ],
    templateUrl: './main-top-bar.component.html',
    styleUrls: ['./main-top-bar.component.scss']
})
export class MainTopBarComponent implements OnInit {

    holdings: Signal<Holding[]> = signal([]);    
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    portfolioStats: Signal<PortfolioStats | null> = signal(null);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.portfolioStats = this._store.selectSignal(holdingsSelectors.getPortfolioStats);
    }

    onHoldingAddClicked(): void {
        this._store.dispatch(mainTopBarActions.showHoldingDialogUpdated({ data: true }));
    }

    onPortfolioDeleteClicked(): void {
        this._store.dispatch(mainTopBarActions.showPortfolioDeleteDialogUpdated({ data: true }));
    }
}
