import {
  NgModule
} from '@angular/core';

import {
  CurrencyPipe,
  DecimalPipe
} from '@angular/common';

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
    SkyNumericService,
    CurrencyPipe,
    DecimalPipe
  ],
  exports: [
    SkyNumericPipe
  ]
})
export class SkyNumericModule { }
