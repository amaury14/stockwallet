import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MeterGroupModule } from 'primeng/metergroup';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { Holding } from '../../../../store/holdings/models';
import { PortfolioPieData, ShareType } from '../../../../store/models';
import { mainContentActions } from './main-content.actions';

@Component({
    selector: 'app-main-content',
    imports: [
        ButtonModule,
        CardModule,
        CommonModule,
        ChartModule,
        MeterGroupModule,
        SkeletonModule,
        TableModule,
        ToolbarModule,
        TooltipModule
    ],
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

    holdings: Signal<Holding[]> = signal([]);
    isHoldingsLoading: Signal<boolean> = signal(false);
    pieChartHoldingsByAmount: Signal<PortfolioPieData | null> = signal(null);
    pieChartHoldingsBySector: Signal<PortfolioPieData | null> = signal(null);
    shareTypes: Signal<ShareType[]> = signal([]);

    pieChartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: 'white'
                }
            }
        }
    };

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.isHoldingsLoading = this._store.selectSignal(holdingsSelectors.isLoading);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.pieChartHoldingsByAmount = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsByAmount);
        this.pieChartHoldingsBySector = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsBySector);
        this.shareTypes = this._store.selectSignal(holdingsSelectors.getAggregatedShareTypes);
    }

    onEditHoldingClicked(data: Holding): void {
        this._store.dispatch(mainContentActions.holdingEditSelected({ data }));
        this._store.dispatch(mainContentActions.showEditHoldingDialogUpdated({ data: true }));
    }
}
