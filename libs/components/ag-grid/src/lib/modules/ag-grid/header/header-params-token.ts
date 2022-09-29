import { InjectionToken } from '@angular/core';

import { SkyAgGridHeaderAppendComponentParams } from '../types/header-append-component-params';

export const SkyAgGridHeaderAppendComponent =
  new InjectionToken<SkyAgGridHeaderAppendComponentParams>(
    'SkyAgGridHeaderAppendComponentParams'
  );
