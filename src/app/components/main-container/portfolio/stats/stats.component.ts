import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { PortfolioBarData, PortfolioLineData } from '../../../../store/models';

@Component({
    selector: 'app-stats',
    imports: [
        CardModule,
        ChartModule,
        CommonModule
    ],
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

    barChartPortfolioContributions: Signal<PortfolioBarData | null> = signal(null);
    chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'white',
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'white',
                    drawBorder: false
                }
            }
        }
    };
    lineChartPortfolioHistory: Signal<PortfolioLineData | null> = signal(null);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.barChartPortfolioContributions = this._store.selectSignal(holdingsSelectors.getBarChartPortfolioContributions);
        this.lineChartPortfolioHistory = this._store.selectSignal(holdingsSelectors.getLineChartPortfolioHistory);
    }
}
