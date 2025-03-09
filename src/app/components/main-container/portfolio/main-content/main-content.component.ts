import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

import { StatsComponent } from '../stats/stats.component';
import { GeneralComponent } from '../general/general.component';

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
export class MainContentComponent { }
