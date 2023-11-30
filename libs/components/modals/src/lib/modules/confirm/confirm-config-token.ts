import { InjectionToken } from '@angular/core';

import { SkyConfirmConfig } from './confirm-config';

/**
 * @internal
 */
export const SKY_CONFIRM_CONFIG = new InjectionToken<SkyConfirmConfig>(
  'SkyConfirmConfig'
);
