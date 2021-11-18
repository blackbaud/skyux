// #region imports
import { SkyLibResourcesProvider } from './lib-resources-provider';
import { InjectionToken } from '@angular/core';

// #endregion

export const SKY_LIB_RESOURCES_PROVIDERS = new InjectionToken<
  SkyLibResourcesProvider[]
>('SKY_LIB_RESOURCES_PROVIDERS');
