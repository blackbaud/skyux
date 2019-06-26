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
  SkyModalConfigurationInterface as IConfig
} from './modal.interface';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
@Injectable()
export class SkyModalService {
  private static host: ComponentRef<SkyModalHostComponent>;

  // TODO: In future breaking change - remove extra parameters as they are no longer used.
  /* tslint:disable:no-unused-variable */
  constructor(
    private dynamicComponentService?: SkyDynamicComponentService
  ) { }

  // Open Overloads
  public open(component: any, providers?: any[]): SkyModalInstance;
  public open(component: any, config?: IConfig): SkyModalInstance;

  // Open Method
  public open(): SkyModalInstance {
    let modalInstance = new SkyModalInstance();
    this.createHostComponent();
    let providersOrConfig: IConfig = arguments[1];
    let params = this.getConfigFromParameter(providersOrConfig);
    let component = arguments[0];

    params.providers.push({
      provide: SkyModalInstance,
      useValue: modalInstance
    });

    SkyModalService.host.instance.open(modalInstance, component, params);

    return modalInstance;
  }

  public dispose() {
    if (SkyModalService.host) {
      this.dynamicComponentService.removeComponent(SkyModalService.host);
      SkyModalService.host = undefined;
    }

  }

  private getConfigFromParameter(providersOrConfig: any) {
    let defaultParams: IConfig = {
      'providers': [],
      'fullPage': false,
      'size': 'medium',
      'tiledBody': false
    };
    let params: any = undefined;
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

  private createHostComponent() {
    if (!SkyModalService.host) {
      SkyModalService.host = this.dynamicComponentService.createComponent(SkyModalHostComponent);
    }
  }
}
