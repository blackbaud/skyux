import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyCardModule,
  SkyInlineDeleteModule
} from '@skyux/layout';

import {
  InlineDeleteCardDemoComponent
} from './inilne-delete-card-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCardModule,
    SkyInlineDeleteModule
  ],
  declarations: [
    InlineDeleteCardDemoComponent
  ],
  exports: [
    InlineDeleteCardDemoComponent
  ]
})
export class InlineDeleteCardDemoModule { }
