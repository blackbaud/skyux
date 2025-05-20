import { Provider } from '@angular/core';

import { SkyRemoteModulesResources } from './remote-modules-resources';
import { SkyRemoteModulesResourcesService } from './remote-modules-resources.service';

/**
 * Provides resource strings to remote modules.
 * @param resources A collection of string resources keyed by the locale.
 * @example
 * ```
 * import en_US_resources from './assets/locales/resources_en_US.json';
 * import fr_CA_resources from './assets/locales/resources_fr_CA.json';
 *
 * @Component({
 *   providers: [
 *     provideSkyRemoteModulesResources({
 *       'EN-US': en_US_resources,
 *       'FR-CA': fr_CA_resources
 *     })
 *   ]
 * })
 * export class MySharedComponent {}
 * ```
 * @experimental
 */
export function provideSkyRemoteModulesResources(
  resources: Record<string, SkyRemoteModulesResources>,
): Provider[] {
  return [
    {
      provide: SkyRemoteModulesResourcesService,
      useFactory(): SkyRemoteModulesResourcesService {
        SkyRemoteModulesResourcesService.addResources(resources);

        return new SkyRemoteModulesResourcesService();
      },
    },
  ];
}
