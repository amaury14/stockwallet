import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-top-stories',
    imports: [
        CommonModule
    ],
    templateUrl: './top-stories.component.html',
    styleUrls: ['./top-stories.component.scss']
})
export class TopStoriesComponent implements AfterViewInit {

    @ViewChild('storiesContainer', { static: true }) storiesContainer!: ElementRef;

    ngAfterViewInit(): void {
        this.loadTradingViewWidget();
    }

    loadTradingViewWidget(): void {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.innerHTML = JSON.stringify({
            "feedMode": "market",
            "market": "stock",
            "isTransparent": false,
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "locale": "en"
        });

        this.storiesContainer.nativeElement.appendChild(script);
    }
}
