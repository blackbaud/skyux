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
  SkyIdModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyInlineFormModule
} from '@skyux/inline-form';

import {
  InlineFormDemoComponent
} from './inline-form-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyIconModule,
    SkyIdModule,
    SkyInlineFormModule
  ],
  exports: [
    InlineFormDemoComponent
  ],
  declarations: [
    InlineFormDemoComponent
  ]
})
export class InlineFormDemoModule { }
