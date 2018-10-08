import {
  NgModule
} from '@angular/core';

import {
  SkyActionButtonModule,
  SkyToolbarModule
 } from './public';

@NgModule({
  imports: [
    SkyActionButtonModule,
    SkyToolbarModule
  ],
  exports: [
    SkyActionButtonModule,
    SkyToolbarModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
