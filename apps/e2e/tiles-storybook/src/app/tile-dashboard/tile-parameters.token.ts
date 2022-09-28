import { InjectionToken } from '@angular/core';

import { TileParametersType } from './tile-parameters.type';

export const TileParameters = new InjectionToken<TileParametersType>(
  'TileParameters'
);
