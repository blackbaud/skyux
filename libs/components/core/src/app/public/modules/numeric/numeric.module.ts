import {
  NgModule
} from '@angular/core';

import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

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
    SkyNumericPipe,
    SkyNumericService
  ],
  imports: [
    SkyI18nModule,
    SkyCoreResourcesModule
  ],
  exports: [
    SkyNumericPipe
  ]
})
export class SkyNumericModule { }
