import {
  NgModule
} from '@angular/core';

import {
  SkyWaitModule
} from '../../public';

import {
  SkyWaitDemoComponent
} from './wait-demo.component';

@NgModule({
  declarations: [
    SkyWaitDemoComponent
  ],
  imports: [
    SkyWaitModule
  ],
  exports: [
    SkyWaitDemoComponent
  ]
})
export class SkyWaitDemoModule {}
