import { InjectionToken } from '@angular/core';

import { SkyLogLevel } from './lib/modules/log/types/log-level';

export const SKY_LOG_LEVEL = new InjectionToken<SkyLogLevel>('SkyLogLevel');
