import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';

import { ToastComponent } from '../components/shared/toast/toast.component';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastComponentRef!: ComponentRef<ToastComponent>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }

    showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title = 'Notificación', duration = 3000) {
        // Create the toast component dynamically
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
        this.toastComponentRef = componentFactory.create(this.injector);

        // Pass data to the component instance
        this.toastComponentRef.instance.message = message;
        this.toastComponentRef.instance.type = type;
        this.toastComponentRef.instance.title = title;
        this.toastComponentRef.instance.duration = duration;

        // Attach the component to the application
        this.appRef.attachView(this.toastComponentRef.hostView);

        // Get the DOM element of the component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const domElem = (this.toastComponentRef.hostView as any).rootNodes[0] as HTMLElement;

        // Append the toast component to the body
        document.body.appendChild(domElem);

        // Show the toast and set up auto-dismiss
        this.toastComponentRef.instance.show();

        // Automatically remove the component after the toast is hidden
        setTimeout(() => {
            this.appRef.detachView(this.toastComponentRef.hostView);
            this.toastComponentRef.destroy();
        }, duration + 500); // Add slight delay for fade-out effect
    }

    destroyToast() {
        if (this.toastComponentRef) {
            this.appRef.detachView(this.toastComponentRef.hostView);
            this.toastComponentRef.destroy();
        }
    }
}
