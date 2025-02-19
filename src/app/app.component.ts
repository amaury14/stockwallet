import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FirebaseService } from './store/firebase.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor(firebaseService: FirebaseService) {
        firebaseService.initializeApp();
    }
}
