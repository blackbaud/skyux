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
  SkyInlineDeleteModule
} from 'projects/layout/src/public-api';

import {
  InlineDeleteDemoComponent
} from './inilne-delete-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule,
    SkyInlineDeleteModule
  ],
  declarations: [
    InlineDeleteDemoComponent
  ],
  exports: [
    InlineDeleteDemoComponent
  ]
})
export class InlineDeleteDemoModule { }
