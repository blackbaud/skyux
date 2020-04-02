
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  IconDemoComponent
} from './icon-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule
  ],
  declarations: [
    IconDemoComponent
  ],
  exports: [
    IconDemoComponent
  ]
})
export class SkyIconDemoComponent { }
