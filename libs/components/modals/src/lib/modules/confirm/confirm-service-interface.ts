import { SkyConfirmConfig } from './confirm-config';
import { SkyConfirmInstance } from './confirm-instance';

/**
 * @internal
 */
export interface SkyConfirmServiceInterface {
  open(config: SkyConfirmConfig): SkyConfirmInstance;
}
