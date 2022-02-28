import { ComponentRef, Injectable, OnDestroy, Provider } from '@angular/core';
import { SkyDynamicComponentService } from '@skyux/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyToast } from './toast';
import { SkyToastBodyContext } from './toast-body-context';
import { SkyToastBodyComponent } from './toast-body.component';
import { SkyToastInstance } from './toast-instance';
import { SkyToasterComponent } from './toaster.component';
import { SkyToastConfig } from './types/toast-config';

@Injectable({
  providedIn: 'root',
})
export class SkyToastService implements OnDestroy {
  /**
   * @internal
   */
  public get toastStream(): Observable<SkyToast[]> {
    return this._toastStream;
  }

  private host: ComponentRef<SkyToasterComponent>;

  private toasts: SkyToast[] = [];

  private _toastStream = new BehaviorSubject<SkyToast[]>([]);

  constructor(private dynamicComponentService: SkyDynamicComponentService) {}

  public ngOnDestroy(): void {
    if (this.host) {
      this.closeAll();
      this.removeHostComponent();
    }
    this._toastStream.complete();
  }

  /**
   * Opens a new toast and displays the specified message.
   * @param message Specifies the text to display in the toast.
   * @param config Specifies additional configuration options for the toast.
   */
  public openMessage(
    message: string,
    config?: SkyToastConfig
  ): SkyToastInstance {
    const context = new SkyToastBodyContext();
    context.message = message;

    const providers = [
      {
        provide: SkyToastBodyContext,
        useValue: context,
      },
    ];

    return this.openComponent(SkyToastBodyComponent, config, providers);
  }

  /**
   * Opens a new toast using a custom component.
   * @param component Specifies an Angular component to inject into the toast body,
   * @param config Specifies additional configuration options for the toast.
   * @param providers Specifies an array of custom providers to pass to the custom component's
   * constructor.
   */
  public openComponent(
    component: any,
    config?: SkyToastConfig,
    providers: Provider[] = []
  ): SkyToastInstance {
    const instance = new SkyToastInstance();

    providers.push({
      provide: SkyToastInstance,
      useValue: instance,
    });

    const toast = new SkyToast(component, providers, config);
    toast.instance = instance;
    this.addToast(toast);

    return instance;
  }

  /**
   * Closes all active toast components.
   */
  public closeAll(): void {
    if (!this.host) {
      return;
    }

    this.host.instance.closeAll();
  }

  private addToast(toast: SkyToast): void {
    if (!this.host) {
      this.createHostComponent();
    }

    this.toasts.push(toast);
    this._toastStream.next(this.toasts);
    toast.instance.closed.subscribe(() => {
      this.removeToast(toast);
    });
  }

  private removeToast(toast: SkyToast): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
    this._toastStream.next(this.toasts);

    if (this.toasts.length === 0) {
      this.removeHostComponent();
    }
  }

  private createHostComponent(): ComponentRef<SkyToasterComponent> {
    this.host =
      this.dynamicComponentService.createComponent(SkyToasterComponent);
    return this.host;
  }

  private removeHostComponent() {
    if (this.host) {
      this.dynamicComponentService.removeComponent(this.host);
      this.host = undefined;
    }
  }
}
