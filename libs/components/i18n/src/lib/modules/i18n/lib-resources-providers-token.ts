// #region imports
import { InjectionToken } from '@angular/core';

import { SkyLibResourcesProvider } from './lib-resources-provider';

// #endregion

/**
 * @deprecated `SKY_LIB_RESOURCES_PROVIDERS` is no longer needed and will be removed in a future major version of SKY UX.
 * @internal
 */
export const SKY_LIB_RESOURCES_PROVIDERS = new InjectionToken<
  SkyLibResourcesProvider[]
>('SKY_LIB_RESOURCES_PROVIDERS');
