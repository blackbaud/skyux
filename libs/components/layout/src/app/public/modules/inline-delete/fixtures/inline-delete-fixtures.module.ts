import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  InlineDeleteTestComponent
} from './inline-delete.component.fixture';

import {
  SkyInlineDeleteModule
} from '..';

@NgModule({
  declarations: [
    InlineDeleteTestComponent
  ],
  imports: [
    CommonModule,
    SkyInlineDeleteModule
  ],
  exports: [
    InlineDeleteTestComponent
  ]
})
export class SkyInlineDeleteFixturesModule { }
