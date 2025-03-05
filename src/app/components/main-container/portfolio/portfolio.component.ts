import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CreatePortfolioDialogComponent } from '../../dialogs/create-portfolio/create-portfolio.component';
import { DeletePortfolioComponent } from '../../dialogs/delete-portfolio/delete-portfolio.component';
import { RegisterPurchaseComponent } from '../../dialogs/register-purchase/register-purchase.component';
import { UpdateContributionsComponent } from '../../dialogs/update-contributions/update-contributions.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainTopBarComponent } from './main-top-bar/main-top-bar.component';
import { PortfolioBarComponent } from './portfolio-bar/portfolio-bar.component';

@Component({
    selector: 'app-portfolio',
    imports: [
        CommonModule,
        CreatePortfolioDialogComponent,
        DeletePortfolioComponent,
        MainContentComponent,
        MainTopBarComponent,
        PortfolioBarComponent,
        RegisterPurchaseComponent,
        UpdateContributionsComponent
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent { }
