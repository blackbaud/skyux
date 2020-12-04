import {
  ComponentRef,
  Injectable
} from '@angular/core';

import {
  SkyDynamicComponentService
} from '@skyux/core';

import {
  SkyModalInstance
} from './modal-instance';

import {
  SkyModalHostComponent
} from './modal-host.component';

import {
  SkyModalConfigurationInterface
} from './modal.interface';

/**
 * A service that lauches modals. For information about how to test modals in SKY UX, see
 * [write unit tests for modals](https://developer.blackbaud.com/skyux/learn/get-started/advanced/unit-test-modals).
 * @dynamic
 */
@Injectable()
export class SkyModalService {

  private static host: ComponentRef<SkyModalHostComponent>;

  // TODO: In future breaking change - remove extra parameters as they are no longer used.
  /* tslint:disable:no-unused-variable */
  constructor(
    private dynamicComponentService?: SkyDynamicComponentService
  ) { }

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
   * Since the component generates dynamically instead of with HTML selectors, consumers must
   * register it with the `entryComponents` property in the `app-extras.module.ts` file.
   * For more information, see the
   * [entry components tutorial](https://developer.blackbaud.com/skyux/learn/get-started/advanced/entry-components).
   * @param {SkyModalConfigurationInterface} config Populates the modal based on the `SkyModalConfigurationInterface` object.
   */
  public open(component: any, config?: SkyModalConfigurationInterface | any[]): SkyModalInstance {
    let modalInstance = new SkyModalInstance();
    this.createHostComponent();
    let params = this.getConfigFromParameter(config);

    params.providers.push({
      provide: SkyModalInstance,
      useValue: modalInstance
    });

    SkyModalService.host.instance.open(modalInstance, component, params);

    return modalInstance;
  }

  private getConfigFromParameter(providersOrConfig: any): SkyModalConfigurationInterface {
    let defaultParams: SkyModalConfigurationInterface = {
      'providers': [],
      'fullPage': false,
      'size': 'medium',
      'tiledBody': false
    };
    let params: SkyModalConfigurationInterface = undefined;
    let method: any = undefined;

    // Object Literal Lookup for backwards compatability.
    method = {
      'providers?': Object.assign({}, defaultParams, { 'providers': providersOrConfig }),
      'config': Object.assign({}, defaultParams, providersOrConfig)
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
      SkyModalService.host = this.dynamicComponentService.createComponent(SkyModalHostComponent);
    }
  }
}
