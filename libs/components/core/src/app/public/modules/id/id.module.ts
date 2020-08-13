import {
  NgModule
} from '@angular/core';

import {
  SkyIdDirective
} from './id.directive';

@NgModule({
  declarations: [
    SkyIdDirective
  ],
  exports: [
    SkyIdDirective
  ]
})
export class SkyIdModule { }
