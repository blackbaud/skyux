import { ModuleWithProviders, NgModule } from '@angular/core';

import { SkyAppConfigHost } from './app-config-host';
import { SkyAppConfigModuleForRootArgs } from './app-config-module-for-root-args';
import { SkyAppConfigParams } from './app-config-params';

/**
 * @deprecated Provide `SkyAppConfig` at the root instead.
 */
@NgModule({})
export class SkyAppConfigModule {
  public static forRoot(
    config: SkyAppConfigModuleForRootArgs = {}
  ): ModuleWithProviders<SkyAppConfigModule> {
    return {
      ngModule: SkyAppConfigModule,
      providers: [
        {
          provide: SkyAppConfigParams,
          useFactory() {
            const appConfigParams = new SkyAppConfigParams();
            appConfigParams.init(config.params);
            return appConfigParams;
          },
        },
        {
          provide: SkyAppConfigHost,
          useFactory() {
            const appConfigHost = new SkyAppConfigHost();
            appConfigHost.init(config.host);
            return appConfigHost;
          },
        },
      ],
    };
  }
}
