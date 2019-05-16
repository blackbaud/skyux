import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsBehaviorDemoComponent
} from './behavior-demo.component';

import {
  SkyDocsBehaviorDemoControlsComponent
} from './behavior-demo-controls.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkyDocsBehaviorDemoComponent,
    SkyDocsBehaviorDemoControlsComponent
  ],
  exports: [
    SkyDocsBehaviorDemoComponent,
    SkyDocsBehaviorDemoControlsComponent
  ]
})
export class SkyDocsBehaviorDemoModule { }
