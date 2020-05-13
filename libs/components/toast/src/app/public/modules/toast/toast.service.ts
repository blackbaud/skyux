// #region imports
import {
  ComponentRef,
  Injectable,
  OnDestroy,
  Provider
} from '@angular/core';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  SkyDynamicComponentService
} from '@skyux/core';

import {
  SkyToastConfig
} from './types/toast-config';

import {
  SkyToast
} from './toast';

import {
  SkyToastBodyComponent
} from './toast-body.component';

import {
  SkyToastInstance
} from './toast-instance';

import {
  SkyToastBodyContext
} from './toast-body-context';

import {
  SkyToasterComponent
} from './toaster.component';
// #endregion

@Injectable()
export class SkyToastService implements OnDestroy {
  public get toastStream(): Observable<SkyToast[]> {
    return this._toastStream;
  }

  private host: ComponentRef<SkyToasterComponent>;
  private toasts: SkyToast[] = [];

  private _toastStream = new BehaviorSubject<SkyToast[]>([]);

  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  public ngOnDestroy() {
    if (this.host) {
      this.closeAll();
      this.removeHostComponent();
    }
    this._toastStream.complete();
  }

  /**
   * Opens a new toast with a text message.
   * @param message Text to display inside the toast
   * @param config Optional configuration
   */
  public openMessage(
    message: string,
    config?: SkyToastConfig
  ): SkyToastInstance {
    const context = new SkyToastBodyContext();
    context.message = message;

    const providers = [{
      provide: SkyToastBodyContext,
      useValue: context
    }];

    return this.openComponent(SkyToastBodyComponent, config, providers);
  }

  /**
   * Opens a new toast using a custom component.
   * @param component Angular component to inject into the toast body
   * @param config Optional configuration
   * @param providers Optional providers for the custom component
   */
  public openComponent(
    component: any,
    config?: SkyToastConfig,
    providers: Provider[] = []
  ): SkyToastInstance {
    const instance = new SkyToastInstance();

    providers.push({
      provide: SkyToastInstance,
      useValue: instance
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
    this.toasts = this.toasts.filter(t => t !== toast);
    this._toastStream.next(this.toasts);

    if (this.toasts.length === 0) {
      this.removeHostComponent();
    }
  }

  private createHostComponent(): ComponentRef<SkyToasterComponent> {
    this.host = this.dynamicComponentService.createComponent(SkyToasterComponent);
    return this.host;
  }

  private removeHostComponent() {
    if (this.host) {
      this.dynamicComponentService.removeComponent(this.host);
      this.host = undefined;
    }

  }
}
