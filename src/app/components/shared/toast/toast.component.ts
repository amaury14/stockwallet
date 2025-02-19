import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-toast',
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    @Input() duration = 3000; // Duration before auto-dismiss in ms
    @Input() message = '';
    @Input() title = 'Notificación';
    @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';

    isVisible = false;

    show(): void {
        this.isVisible = true;
        setTimeout(() => this.isVisible = false, this.duration);
    }

    closeToast(): void {
        this.isVisible = false;
    }
}
