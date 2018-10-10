import {
  NgModule
} from '@angular/core';

import {
  SkyEmailValidationModule,
  SkyUrlValidationModule
} from './public';

@NgModule({
  imports: [
    SkyEmailValidationModule,
    SkyUrlValidationModule
  ],
  exports: [
    SkyEmailValidationModule,
    SkyUrlValidationModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
