import {
  NgModule
} from '@angular/core';

import {
  SkySampleModule
} from './public';

const temp = require('raw-loader!../assets/locales/resources_en_US.json');

@NgModule({
  imports: [
    SkySampleModule
  ],
  exports: [
    SkySampleModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
