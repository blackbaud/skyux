import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyInlineFormFixtureComponent
} from './inline-form.fixture';

import {
  SkyInlineFormModule
} from '../inline-form.module';

@NgModule({
  declarations: [
    SkyInlineFormFixtureComponent
  ],
  imports: [
    CommonModule,
    SkyInlineFormModule
  ]
})
export class SkyInlineFormFixtureModule { }
