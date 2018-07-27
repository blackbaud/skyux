import {
  NgModule
} from '@angular/core';

import {
  SkyNumericModule
} from '../../modules';

import {
  SkyNumericDemoComponent
} from './numeric-demo.component';

@NgModule({
  declarations: [
    SkyNumericDemoComponent
  ],
  imports: [
    SkyNumericModule
  ],
  exports: [
    SkyNumericDemoComponent
  ]
})
export class SkyNumericDemoModule {}
