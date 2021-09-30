import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyInlineFormComponent
} from './inline-form.component';

import {
  SkyInlineFormResourcesModule
} from '../shared/sky-inline-form-resources.module';

@NgModule({
  declarations: [
    SkyInlineFormComponent
  ],
  imports: [
    CommonModule,
    SkyInlineFormResourcesModule
  ],
  exports: [
    SkyInlineFormComponent
  ]
})
export class SkyInlineFormModule { }
