import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyTokenComponent
} from './token.component';
import {
  SkyTokensComponent
} from './tokens.component';
import {
  SkyIconModule
} from '../icon';

@NgModule({
  declarations: [
    SkyTokenComponent,
    SkyTokensComponent
  ],
  imports: [
    CommonModule,
    SkyIconModule
  ],
  exports: [
    SkyTokenComponent,
    SkyTokensComponent
  ]
})
export class SkyTokensModule { }
