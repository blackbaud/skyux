import {
  NgModule
} from '@angular/core';

import {
  SkyLabelModule
} from '../../public';

import {
  SkyLabelDemoComponent
} from './label-demo.component';

@NgModule({
  declarations: [
    SkyLabelDemoComponent
  ],
  imports: [
    SkyLabelModule
  ],
  exports: [
    SkyLabelDemoComponent
  ]
})
export class SkyLabelDemoModule {}
