import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  StacheEditButtonComponent
} from './edit-button.component';

@NgModule({
  declarations: [
    StacheEditButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheEditButtonComponent
  ],
  providers: [
    SkyAppConfig
  ]
})
export class StacheEditButtonModule { }
