import {
  NgModule
} from '@angular/core';

import {
  SkyChevronModule
} from '../../public';

import {
  SkyChevronDemoComponent
} from './chevron-demo.component';

@NgModule({
  declarations: [
    SkyChevronDemoComponent
  ],
  imports: [
    SkyChevronModule
  ],
  exports: [
    SkyChevronDemoComponent
  ]
})
export class SkyChevronDemoModule {}
