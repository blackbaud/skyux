import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyCoreResourcesModule
} from '../shared/core-resources.module';

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
