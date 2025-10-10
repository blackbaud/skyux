import { InjectionToken } from '@angular/core';

import { SkyFilterAdapterService } from './filter-adapter.service';

/**
 * Injection token for the filter adapter service.
 */
export const SKY_FILTER_ADAPTER_SERVICE =
  new InjectionToken<SkyFilterAdapterService>('SkyFilterAdapterService');
