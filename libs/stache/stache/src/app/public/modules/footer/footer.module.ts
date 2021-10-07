import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  StacheFooterComponent
} from './footer.component'
;
import {
  StacheNavModule
} from '../nav/nav.module';

import {
  StacheResourcesModule
} from '../shared/stache-resources.module';

@NgModule({
  imports: [
    CommonModule,
    StacheResourcesModule,
    StacheNavModule
  ],
  declarations: [
    StacheFooterComponent
  ],
  exports: [
    StacheFooterComponent
  ]
})
export class StacheFooterModule { }
