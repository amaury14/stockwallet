import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-sp500-heatmap',
    imports: [
        CommonModule
    ],
    templateUrl: './sp-500-heatmap.component.html',
    styleUrls: ['./sp-500-heatmap.component.scss']
})
export class Sp500HeatmapComponent implements AfterViewInit {

    @ViewChild('heatmapContainer', { static: true }) heatmapContainer!: ElementRef;

    ngAfterViewInit(): void {
        this.loadTradingViewWidget();
    }

    loadTradingViewWidget(): void {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.innerHTML = JSON.stringify({
            "exchanges": [],
            "dataSource": "SPX500",
            "grouping": "sector",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "locale": "en",
            "symbolUrl": "",
            "colorTheme": "dark",
            "hasTopBar": false,
            "isDataSetEnabled": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "isMonoSize": false,
            "width": "100%",
            "height": "100%"
        });

        this.heatmapContainer.nativeElement.appendChild(script);
    }
}
