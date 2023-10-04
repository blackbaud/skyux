import {
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  OnDestroy,
  Provider,
  Type,
  inject,
} from '@angular/core';
import {
  SkyDynamicComponentLegacyService,
  SkyDynamicComponentService,
} from '@skyux/core';

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
  private static host: ComponentRef<SkyToasterComponent> | undefined;
  private static toasts: SkyToast[] = [];
  private static toastStream = new BehaviorSubject<SkyToast[]>([]);

  /**
   * @internal
   */
  public get toastStream(): Observable<SkyToast[]> {
    return SkyToastService.toastStream;
  }

  #dynamicComponentService: SkyDynamicComponentService;
  #environmentInjector = inject(EnvironmentInjector);

  constructor(dynamicComponentService: SkyDynamicComponentService) {
    this.#dynamicComponentService = dynamicComponentService;
  }

  public ngOnDestroy(): void {
    if (SkyToastService.host) {
      this.closeAll();
      this.#removeHostComponent();
    }

    SkyToastService.toastStream.complete();
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
    component: Type<unknown>,
    config?: SkyToastConfig,
    providers: Provider[] = []
  ): SkyToastInstance {
    const instance = new SkyToastInstance();

    providers.push({
      provide: SkyToastInstance,
      useValue: instance,
    });

    const toast = new SkyToast(component, providers, instance, config);
    this.#addToast(toast, instance);

    return instance;
  }

  /**
   * Closes all active toast components.
   */
  public closeAll(): void {
    if (!SkyToastService.host) {
      return;
    }

    SkyToastService.host.instance.closeAll();
  }

  #addToast(toast: SkyToast, instance: SkyToastInstance): void {
    if (!SkyToastService.host) {
      SkyToastService.host = this.#createHostComponent();
    }

    SkyToastService.toasts.push(toast);
    SkyToastService.toastStream.next(SkyToastService.toasts);
    instance.closed.subscribe(() => {
      this.#removeToast(toast);
    });
  }

  #removeToast(toast: SkyToast): void {
    SkyToastService.toasts = SkyToastService.toasts.filter((t) => t !== toast);
    SkyToastService.toastStream.next(SkyToastService.toasts);

    if (SkyToastService.toasts.length === 0) {
      this.#removeHostComponent();
    }
  }

  #createHostComponent(): ComponentRef<SkyToasterComponent> {
    const componentRef = this.#dynamicComponentService.createComponent(
      SkyToasterComponent,
      {
        environmentInjector: this.#environmentInjector,
      }
    );

    return componentRef;
  }

  #removeHostComponent(): void {
    if (SkyToastService.host) {
      this.#dynamicComponentService.removeComponent(SkyToastService.host);
      SkyToastService.host = undefined;
    }
  }
}

/**
 * @internal
 * @deprecated Use `SkyToastService` to open a standalone component instead.
 */
@Injectable({
  // Toast service has always been provided in root, but we need
  // to inject SkyDynamicComponentLegacyService for backward compatibility.
  providedIn: 'root',
})
export class SkyToastLegacyService extends SkyToastService {
  /* istanbul ignore next */
  constructor(dynamicComponentSvc: SkyDynamicComponentLegacyService) {
    super(dynamicComponentSvc);
  }
}
