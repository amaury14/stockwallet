import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-ui-loader',
    imports: [CommonModule, ProgressSpinnerModule],
    templateUrl: './ui-loader.component.html',
    styleUrls: ['./ui-loader.component.scss']
})
export class UiLoaderComponent {}
