import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyCoreResourcesModule
} from '../shared/sky-core-resources.module';

import {
  SkyNumericPipe
} from './numeric.pipe';

@NgModule({
  declarations: [
    SkyNumericPipe
  ],
  providers: [
    SkyNumericPipe
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
