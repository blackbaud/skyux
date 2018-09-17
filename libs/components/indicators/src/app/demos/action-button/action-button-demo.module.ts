import {
  NgModule
} from '@angular/core';

import {
  SkyActionButtonModule
} from '../../public';

import {
  SkyActionButtonDemoComponent
} from './action-button-demo.component';

@NgModule({
  declarations: [
    SkyActionButtonDemoComponent
  ],
  imports: [
    SkyActionButtonModule
  ],
  exports: [
    SkyActionButtonDemoComponent
  ]
})
export class SkyActionButtonDemoModule {}
