import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyTokensModule
} from '../tokens.module';

import {
  SkyTokensTestComponent
} from './tokens.component.fixture';

@NgModule({
  declarations: [
    SkyTokensTestComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkyTokensModule
  ],
  exports: [
    SkyTokensTestComponent
  ]
})
export class SkyTokensFixturesModule { }
