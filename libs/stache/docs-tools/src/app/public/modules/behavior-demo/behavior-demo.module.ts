import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsBehaviorDemoComponent
} from './behavior-demo.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkyDocsBehaviorDemoComponent
  ],
  exports: [
    SkyDocsBehaviorDemoComponent
  ]
})
export class SkyDocsBehaviorDemoModule { }
