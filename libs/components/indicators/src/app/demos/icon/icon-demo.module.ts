import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '../../public';

import {
  SkyIconDemoComponent
} from './icon-demo.component';

@NgModule({
  declarations: [
    SkyIconDemoComponent
  ],
  imports: [
    SkyIconModule
  ],
  exports: [
    SkyIconDemoComponent
  ]
})
export class SkyIconDemoModule {}
