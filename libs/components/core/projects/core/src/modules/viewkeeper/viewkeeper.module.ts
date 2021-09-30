import {
  NgModule
} from '@angular/core';

import {
  SkyViewkeeperDirective
} from './viewkeeper.directive';

@NgModule({
  declarations: [
    SkyViewkeeperDirective
  ],
  exports: [
    SkyViewkeeperDirective
  ]
})
export class SkyViewkeeperModule { }
