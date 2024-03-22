import { StaticProvider, Type } from '@angular/core';

import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * @internal
 */
export interface SkyModalServiceInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open<TComponent = any>(
    component: Type<TComponent>,
    config?: SkyModalConfigurationInterface | StaticProvider[],
  ): SkyModalInstance;
}
