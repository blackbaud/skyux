import { Type } from '@angular/core';

import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * @internal
 */
export interface SkyModalServiceInterface {
  open<TComponent = any>(
    component: Type<TComponent>,
    config?: SkyModalConfigurationInterface | any[],
  ): SkyModalInstance<TComponent>;
}
