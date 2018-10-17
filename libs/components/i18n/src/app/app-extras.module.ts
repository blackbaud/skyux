import {
  NgModule
} from '@angular/core';

import {
  SkySampleResourcesModule
} from './demos';

@NgModule({
  exports: [
    SkySampleResourcesModule
  ]
})
export class AppExtrasModule { }
