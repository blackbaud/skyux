import {
  NgModule
} from '@angular/core';

import {
  SkyTokensModule
} from '../../public';

import {
  SkyTokensDemoComponent
} from './tokens-demo.component';

@NgModule({
  declarations: [
    SkyTokensDemoComponent
  ],
  imports: [
    SkyTokensModule
  ],
  exports: [
    SkyTokensDemoComponent
  ]
})
export class SkyTokensDemoModule {}
