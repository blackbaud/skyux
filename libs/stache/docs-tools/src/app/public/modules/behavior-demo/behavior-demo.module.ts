import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyRadioModule, SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyDocsToolsResourcesModule
} from '../shared/docs-tools-resources.module';

import {
  SkyDocsBehaviorDemoComponent
} from './behavior-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDocsToolsResourcesModule,
    SkyRadioModule
  ],
  declarations: [
    SkyDocsBehaviorDemoComponent
  ],
  exports: [
    SkyDocsBehaviorDemoComponent
  ]
})
export class SkyDocsBehaviorDemoModule { }
