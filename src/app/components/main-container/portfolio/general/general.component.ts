import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MeterGroupModule } from 'primeng/metergroup';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { Holding } from '../../../../store/holdings/models';
import { PortfolioPieData, ShareType } from '../../../../store/models';
import { generalActions } from './general.actions';

@Component({
    selector: 'app-general',
    imports: [
        ButtonModule,
        CardModule,
        CommonModule,
        ChartModule,
        MeterGroupModule,
        SkeletonModule,
        TableModule,
        TabsModule,
        ToolbarModule,
        TooltipModule
    ],
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

    holdings: Signal<Holding[]> = signal([]);
    isHoldingsLoading: Signal<boolean> = signal(false);
    pieChartHoldingsByAmount: Signal<PortfolioPieData | null> = signal(null);
    pieChartHoldingsBySector: Signal<PortfolioPieData | null> = signal(null);
    shareTypes: Signal<ShareType[]> = signal([]);

    pieChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
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
        this._store.dispatch(generalActions.holdingEditSelected({ data }));
        this._store.dispatch(generalActions.showEditHoldingDialogUpdated({ data: true }));
    }
}
