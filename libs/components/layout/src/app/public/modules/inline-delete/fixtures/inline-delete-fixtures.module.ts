import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  InlineDeleteTestComponent
} from './inline-delete.component.fixture';

import {
  SkyInlineDeleteModule
} from '../inline-delete.module';

@NgModule({
  declarations: [
    InlineDeleteTestComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkyInlineDeleteModule
  ],
  exports: [
    InlineDeleteTestComponent
  ]
})
export class SkyInlineDeleteFixturesModule { }
