import { Provider } from '@angular/core';

import { SkyRemoteModulesResources } from './remote-modules-resources';
import { SkyRemoteModulesResourcesService } from './remote-modules-resources.service';

/**
 *
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
