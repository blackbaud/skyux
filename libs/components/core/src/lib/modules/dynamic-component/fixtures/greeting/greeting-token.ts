import { InjectionToken } from '@angular/core';

import { GreetingConfig } from './greeting-config';

export const GREETING_CONFIG = new InjectionToken<GreetingConfig>(
  'GreetingConfig'
);
