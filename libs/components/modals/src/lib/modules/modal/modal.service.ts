import { ComponentRef, Injectable } from '@angular/core';
import { SkyDynamicComponentService } from '@skyux/core';

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
  // injector and may loose context if the modal was opened from within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyModalService {
  private static host: ComponentRef<SkyModalHostComponent>;

  // TODO: In future breaking change - remove extra parameters as they are no longer used.
  /* tslint:disable:no-unused-variable */
  constructor(private dynamicComponentService?: SkyDynamicComponentService) {}

  /**
   * @private
   * Removes the modal host from the DOM.
   */
  public dispose(): void {
    if (SkyModalService.host) {
      this.dynamicComponentService.removeComponent(SkyModalService.host);
      SkyModalService.host = undefined;
    }
  }

  /**
   * Opens a modal using the specified component.
   * @param component Determines the component to render.
   * @param {SkyModalConfigurationInterface} config Populates the modal based on the `SkyModalConfigurationInterface` object.
   */
  public open(
    component: any,
    config?: SkyModalConfigurationInterface | any[]
  ): SkyModalInstance {
    const modalInstance = new SkyModalInstance();
    this.createHostComponent();
    const params = this.getConfigFromParameter(config);

    params.providers.push({
      provide: SkyModalInstance,
      useValue: modalInstance,
    });

    SkyModalService.host.instance.open(modalInstance, component, params);

    return modalInstance;
  }

  private getConfigFromParameter(
    providersOrConfig: any
  ): SkyModalConfigurationInterface {
    const defaultParams: SkyModalConfigurationInterface = {
      providers: [],
      fullPage: false,
      size: 'medium',
      tiledBody: false,
    };
    let params: SkyModalConfigurationInterface = undefined;
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

  private createHostComponent(): void {
    if (!SkyModalService.host) {
      SkyModalService.host = this.dynamicComponentService.createComponent(
        SkyModalHostComponent
      );
    }
  }
}
