import { Provider, Type } from '@angular/core';

import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * @internal
 */
export interface SkyModalServiceInterface {
  open<T>(
    component: Type<T>,
    config?: SkyModalConfigurationInterface | Provider[],
  ): SkyModalInstance;
}
