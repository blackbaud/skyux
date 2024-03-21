import {
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Provider,
  Type,
  inject,
} from '@angular/core';
import {
  SkyDynamicComponentLegacyService,
  SkyDynamicComponentService,
} from '@skyux/core';

import { applyDefaultOptions } from './apply-default-options';
import { SkyModalHostContext } from './modal-host-context';
import { SkyModalHostComponent } from './modal-host.component';
import { SkyModalInstance } from './modal-instance';
import { SkyModalServiceInterface } from './modal-service-interface';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * A service that launches modals.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyModalService implements SkyModalServiceInterface {
  private static host: ComponentRef<SkyModalHostComponent> | undefined; // <-- how do we handle only having one of these?

  #dynamicComponentService: SkyDynamicComponentService;
  #environmentInjector = inject(EnvironmentInjector);

  constructor(dynamicComponentService: SkyDynamicComponentService) {
    this.#dynamicComponentService = dynamicComponentService;
  }

  /**
   * @internal
   * Removes the modal host from the DOM.
   */
  public dispose(): void {
    if (SkyModalService.host) {
      this.#dynamicComponentService.removeComponent(SkyModalService.host);
      SkyModalService.host = undefined;
    }
  }

  /**
   * Opens a modal using the specified component.
   * @param component Determines the component to render.
   * @param {SkyModalConfigurationInterface} config Specifies configuration options for the modal.
   */
  public open<T>(
    component: Type<T>,
    config?: SkyModalConfigurationInterface | Provider[],
  ): SkyModalInstance {
    const modalInstance = new SkyModalInstance();

    if (!SkyModalService.host) {
      SkyModalService.host = this.#createHostComponent();
    }

    const params = applyDefaultOptions(config);
    params.providers ||= [];
    params.providers.push({
      provide: SkyModalInstance,
      useValue: modalInstance,
    });

    if (SkyModalService.host) {
      SkyModalService.host.instance.open(
        modalInstance,
        component,
        params,
        this.#environmentInjector,
      );
    }

    return modalInstance;
  }

  #createHostComponent(): ComponentRef<SkyModalHostComponent> {
    const componentRef = this.#dynamicComponentService.createComponent(
      SkyModalHostComponent,
      {
        environmentInjector: this.#environmentInjector,
        providers: [
          {
            provide: SkyModalHostContext,
            useValue: new SkyModalHostContext({
              teardownCallback: (): void => {
                this.dispose();
              },
            }),
          },
        ],
      },
    );

    return componentRef;
  }
}

/**
 * A service that launches modals.
 * @internal
 * @deprecated Use `SkyModalService` to open a standalone component instead.
 */
@Injectable({
  // Must be 'any' so that the modal component is created in the context of its module's injector.
  // If set to 'root', the component's dependency injections would only be derived from the root
  // injector and may lose context if the modal was opened from within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyModalLegacyService extends SkyModalService {
  /* istanbul ignore next */
  constructor(dynamicComponentSvc: SkyDynamicComponentLegacyService) {
    super(dynamicComponentSvc);
  }
}
