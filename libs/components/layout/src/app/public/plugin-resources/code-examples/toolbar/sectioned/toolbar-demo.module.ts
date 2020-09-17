import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  ToolbarDemoComponent
} from './toolbar-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule,
    SkyToolbarModule
  ],
  exports: [
    ToolbarDemoComponent
  ],
  declarations: [
    ToolbarDemoComponent
  ]
})
export class ToolbarDemoModule { }
