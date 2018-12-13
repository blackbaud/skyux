import {
  NgModule
} from '@angular/core';

import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  SkyCoreResourcesModule
} from '../shared';

import {
  SkyNumericPipe
} from './numeric.pipe';

import {
  SkyNumericService
} from './numeric.service';

@NgModule({
  declarations: [
    SkyNumericPipe
  ],
  providers: [
    CurrencyPipe,
    DecimalPipe,
    SkyNumericService
  ],
  imports: [
    SkyCoreResourcesModule
  ],
  exports: [
    SkyNumericPipe
  ]
})
export class SkyNumericModule { }
