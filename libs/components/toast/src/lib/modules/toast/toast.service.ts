import {
  ComponentRef,
  INJECTOR,
  Injectable,
  OnDestroy,
  Provider,
  StaticProvider,
  Type,
  inject,
} from '@angular/core';
import { SkyDynamicComponentService } from '@skyux/core';
import { SKY_LIB_RESOURCES_PROVIDERS } from '@skyux/i18n';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyToastResourcesProvider } from '../shared/sky-toast-resources.module';

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
    return this.#toastStream;
  }

  #dynamicComponentService: SkyDynamicComponentService;
  #injector = inject(INJECTOR);
  #host: ComponentRef<SkyToasterComponent> | undefined;
  #toasts: SkyToast[] = [];
  #toastStream = new BehaviorSubject<SkyToast[]>([]);

  constructor(dynamicComponentService: SkyDynamicComponentService) {
    this.#dynamicComponentService = dynamicComponentService;
  }

  public ngOnDestroy(): void {
    if (this.#host) {
      this.closeAll();
      this.#removeHostComponent();
    }

    this.#toastStream.complete();
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
    if (!this.#host) {
      return;
    }

    this.#host.instance.closeAll();
  }

  #addToast(toast: SkyToast, instance: SkyToastInstance): void {
    if (!this.#host) {
      this.#createHostComponent();
    }

    this.#toasts.push(toast);
    this.#toastStream.next(this.#toasts);
    instance.closed.subscribe(() => {
      this.#removeToast(toast);
    });
  }

  #removeToast(toast: SkyToast): void {
    this.#toasts = this.#toasts.filter((t) => t !== toast);
    this.#toastStream.next(this.#toasts);

    if (this.#toasts.length === 0) {
      this.#removeHostComponent();
    }
  }

  #createHostComponent(): ComponentRef<SkyToasterComponent> {
    this.#host = this.#dynamicComponentService.createComponent(
      SkyToasterComponent,
      {
        parentInjector: this.#injector,
        providers: [
          {
            provide: SKY_LIB_RESOURCES_PROVIDERS,
            useClass: SkyToastResourcesProvider,
            multi: true,
          },
        ] as StaticProvider[],
      }
    );
    return this.#host;
  }

  #removeHostComponent(): void {
    if (this.#host) {
      this.#dynamicComponentService.removeComponent(this.#host);
      this.#host = undefined;
    }
  }
}
