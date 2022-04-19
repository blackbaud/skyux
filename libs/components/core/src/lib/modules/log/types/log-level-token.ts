import { InjectionToken } from '@angular/core';

import { SkyLogLevel } from './log-level';

export const SKY_LOG_LEVEL = new InjectionToken<SkyLogLevel>('SkyLogLevel');
