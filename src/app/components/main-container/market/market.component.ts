import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Sp500HeatmapComponent } from './sp-500-heatmap/sp-500-heatmap.component';
import { TopStoriesComponent } from './top-stories/top-stories.component';

@Component({
    selector: 'app-market',
    imports: [
        CommonModule,
        Sp500HeatmapComponent,
        TopStoriesComponent
    ],
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss']
})
export class MarketComponent { }
