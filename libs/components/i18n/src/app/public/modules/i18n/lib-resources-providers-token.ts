// #region imports
import {
  InjectionToken
} from '@angular/core';

import {
  SkyLibResourcesProvider
} from './lib-resources-provider';
// #endregion

export const SKY_LIB_RESOURCES_PROVIDERS =
  new InjectionToken<SkyLibResourcesProvider>('SKY_LIB_RESOURCES_PROVIDERS');
