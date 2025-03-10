import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

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
        FormsModule,
        InputNumberModule,
        ToolbarModule,
        TooltipModule
    ],
    templateUrl: './main-top-bar.component.html',
    styleUrls: ['./main-top-bar.component.scss']
})
export class MainTopBarComponent implements OnInit {

    cashBalance = 0;
    holdings: Signal<Holding[]> = signal([]);
    isEditing = signal(false);
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    portfolioStats: Signal<PortfolioStats | null> = signal(null);

    constructor(private _store: Store) {
        effect(() => {
            if (this.portfolioStats()?.cashValue! >= 0) {
                this.cashBalance = this.portfolioStats()?.cashValue!;
            }
        });
    }

    ngOnInit(): void {
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.portfolioStats = this._store.selectSignal(holdingsSelectors.getPortfolioStats);
    }

    onCalculateContributionClicked(): void {
        this._store.dispatch(mainTopBarActions.showCalculateContributionDialogUpdated({ data: true }));
    }

    onEditChashClicked(isEditing: boolean): void {
        if (isEditing && this.cashBalance !== this.portfolioStats()?.cashValue) {
            this._store.dispatch(mainTopBarActions.cashBalanceUpdated({ data: this.cashBalance }));
        }
        this.isEditing.set(!isEditing);
    }

    onHoldingAddClicked(): void {
        this._store.dispatch(mainTopBarActions.showHoldingDialogUpdated({ data: true }));
    }

    onPortfolioDeleteClicked(): void {
        this._store.dispatch(mainTopBarActions.showPortfolioDeleteDialogUpdated({ data: true }));
    }
}
