import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import {
  SkyAppConfigModuleForRootArgs
} from './app-config-module-for-root-args';

import {
  SkyAppConfigHost
} from './app-config-host';

import {
  SkyAppConfigParams
} from './app-config-params';

import {
  SkyAppParamsConfig
} from './params-config';

@NgModule({})
export class SkyAppConfigModule {

  public static forRoot(
    config: SkyAppConfigModuleForRootArgs = {}
  ): ModuleWithProviders<SkyAppConfigModule> {

    return {
      ngModule: SkyAppConfigModule,
      providers: [
        {
          provide: SkyAppParamsConfig,
          useFactory() {
            return new SkyAppParamsConfig({
              params: config.params
            });
          }
        },
        {
          provide: SkyAppConfigParams,
          useFactory() {
            const appConfigParams = new SkyAppConfigParams();
            appConfigParams.init(config.params);
            return appConfigParams;
          }
        },
        {
          provide: SkyAppConfigHost,
          useFactory() {
            const appConfigHost = new SkyAppConfigHost();
            appConfigHost.init(config.host);
            return appConfigHost;
          }
        }
      ]
    };
  }
}
