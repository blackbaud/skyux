import { ComponentRef, Injectable } from '@angular/core';
import { SkyDynamicComponentService } from '@skyux/core';

import { SkyModalHostContext } from './modal-host-context';
import { SkyModalHostComponent } from './modal-host.component';
import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * A service that launches modals.
 * @dynamic
 */
@Injectable({
  // Must be 'any' so that the modal component is created in the context of its module's injector.
  // If set to 'root', the component's dependency injections would only be derived from the root
  // injector and may lose context if the modal was opened from within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyModalService {
  private static host: ComponentRef<SkyModalHostComponent> | undefined;

  #dynamicComponentService: SkyDynamicComponentService;

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
  public open(
    component: any,
    config?: SkyModalConfigurationInterface | any[]
  ): SkyModalInstance {
    const modalInstance = new SkyModalInstance();
    this.#createHostComponent();
    const params = this.#getConfigFromParameter(config);

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    params.providers!.push({
      provide: SkyModalInstance,
      useValue: modalInstance,
    });

    SkyModalService.host!.instance.open(modalInstance, component, params);
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return modalInstance;
  }

  #getConfigFromParameter(
    providersOrConfig: any
  ): SkyModalConfigurationInterface {
    const defaultParams: SkyModalConfigurationInterface = {
      providers: [],
      fullPage: false,
      size: 'medium',
      tiledBody: false,
    };
    let params: SkyModalConfigurationInterface = {};
    let method: any = undefined;

    // Object Literal Lookup for backwards compatability.
    method = {
      'providers?': Object.assign({}, defaultParams, {
        providers: providersOrConfig,
      }),
      config: Object.assign({}, defaultParams, providersOrConfig),
    };

    if (Array.isArray(providersOrConfig) === true) {
      params = method['providers?'];
    } else {
      params = method['config'];
    }

    return params;
  }

  #createHostComponent(): void {
    if (!SkyModalService.host) {
      SkyModalService.host = this.#dynamicComponentService.createComponent(
        SkyModalHostComponent,
        {
          providers: [
            {
              provide: SkyModalHostContext,
              useValue: new SkyModalHostContext({
                teardownCallback: () => {
                  this.dispose();
                },
              }),
            },
          ],
        }
      );
    }
  }
}
