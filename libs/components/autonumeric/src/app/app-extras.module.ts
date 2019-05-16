import {
  NgModule
} from '@angular/core';

import {
  MyLibrarySampleModule
} from './public';

@NgModule({
  exports: [
    MyLibrarySampleModule
  ]
})
export class AppExtrasModule { }
