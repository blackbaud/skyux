import {
  NgModule
} from '@angular/core';

import {
  SkyColorpickerModule
} from './public';

@NgModule({
  imports: [
    SkyColorpickerModule
  ],
  exports: [
    SkyColorpickerModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
