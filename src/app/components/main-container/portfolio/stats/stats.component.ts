import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartModule } from 'primeng/chart';

import { holdingsSelectors } from '../../../../store/holdings/holdings.selector';
import { PortfolioBarData } from '../../../../store/models';

@Component({
    selector: 'app-stats',
    imports: [
        ChartModule,
        CommonModule
    ],
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

    lineChartPortfolioContributions: Signal<PortfolioBarData | null> = signal(null);
    lineChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
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

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.lineChartPortfolioContributions = this._store.selectSignal(holdingsSelectors.getBarChartPortfolioContributions);
    }
}
